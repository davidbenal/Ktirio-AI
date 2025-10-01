import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PricingPlan } from '../services/stripeService';

interface UserCredits {
  credits: number;
  plan: PricingPlan;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'trialing' | null;
  subscriptionId: string | null;
  lastReset: string;
}

interface CreditsContextType {
  credits: number;
  plan: PricingPlan;
  subscriptionStatus: UserCredits['subscriptionStatus'];
  loading: boolean;
  useCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits deve ser usado dentro de um CreditsProvider');
  }
  return context;
};

interface CreditsProviderProps {
  children: ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState<PricingPlan>(PricingPlan.FREE);
  const [subscriptionStatus, setSubscriptionStatus] = useState<UserCredits['subscriptionStatus']>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa os créditos do usuário
  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    const userCreditsRef = doc(db, 'users', user.id);

    // Listener em tempo real para mudanças nos créditos
    const unsubscribe = onSnapshot(userCreditsRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as UserCredits;
        setCredits(data.credits);
        setPlan(data.plan);
        setSubscriptionStatus(data.subscriptionStatus);
      } else {
        // Cria documento inicial para novo usuário
        const initialData: UserCredits = {
          credits: 10, // Créditos iniciais gratuitos
          plan: PricingPlan.FREE,
          subscriptionStatus: null,
          subscriptionId: null,
          lastReset: new Date().toISOString(),
        };
        await setDoc(userCreditsRef, initialData);
        setCredits(initialData.credits);
        setPlan(initialData.plan);
        setSubscriptionStatus(initialData.subscriptionStatus);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isLoaded]);

  /**
   * Usa uma quantidade de créditos
   * Retorna true se teve créditos suficientes, false caso contrário
   */
  const useCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;

    if (credits < amount) {
      return false;
    }

    try {
      const userCreditsRef = doc(db, 'users', user.id);
      await updateDoc(userCreditsRef, {
        credits: credits - amount,
      });
      return true;
    } catch (error) {
      console.error('Erro ao usar créditos:', error);
      return false;
    }
  };

  /**
   * Adiciona créditos à conta do usuário
   */
  const addCredits = async (amount: number): Promise<void> => {
    if (!user) return;

    try {
      const userCreditsRef = doc(db, 'users', user.id);
      await updateDoc(userCreditsRef, {
        credits: credits + amount,
      });
    } catch (error) {
      console.error('Erro ao adicionar créditos:', error);
      throw error;
    }
  };

  /**
   * Atualiza os créditos manualmente
   */
  const refreshCredits = async (): Promise<void> => {
    if (!user) return;

    try {
      const userCreditsRef = doc(db, 'users', user.id);
      const docSnapshot = await getDoc(userCreditsRef);
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as UserCredits;
        setCredits(data.credits);
        setPlan(data.plan);
        setSubscriptionStatus(data.subscriptionStatus);
      }
    } catch (error) {
      console.error('Erro ao atualizar créditos:', error);
    }
  };

  const value: CreditsContextType = {
    credits,
    plan,
    subscriptionStatus,
    loading,
    useCredits,
    addCredits,
    refreshCredits,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};
