import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Inicializa o Stripe
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key não encontrada');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

/**
 * Tipos de planos disponíveis
 */
export enum PricingPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

/**
 * Configuração dos planos
 */
export const PLANS = {
  [PricingPlan.FREE]: {
    name: 'Gratuito',
    credits: 10,
    price: 0,
    priceId: null,
    features: [
      '10 créditos por mês',
      'Qualidade standard',
      'Suporte por email',
    ],
  },
  [PricingPlan.BASIC]: {
    name: 'Básico',
    credits: 100,
    price: 29.90,
    priceId: 'price_basic_monthly', // Substituir com o ID real do Stripe
    features: [
      '100 créditos por mês',
      'Qualidade HD',
      'Suporte prioritário',
      'Sem marca d\'água',
    ],
  },
  [PricingPlan.PRO]: {
    name: 'Profissional',
    credits: 500,
    price: 99.90,
    priceId: 'price_pro_monthly', // Substituir com o ID real do Stripe
    features: [
      '500 créditos por mês',
      'Qualidade 4K',
      'Suporte 24/7',
      'Sem marca d\'água',
      'API access',
    ],
  },
  [PricingPlan.ENTERPRISE]: {
    name: 'Empresarial',
    credits: -1, // Ilimitado
    price: 299.90,
    priceId: 'price_enterprise_monthly', // Substituir com o ID real do Stripe
    features: [
      'Créditos ilimitados',
      'Qualidade 8K',
      'Suporte dedicado',
      'Sem marca d\'água',
      'API access',
      'Treinamento personalizado',
    ],
  },
};

/**
 * Cria uma sessão de checkout do Stripe
 */
export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  userEmail: string
): Promise<string | null> => {
  try {
    // Aqui você fará uma chamada para seu backend
    // que irá criar a sessão de checkout no Stripe
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
      }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return null;
  }
};

/**
 * Redireciona para o checkout do Stripe
 */
export const redirectToCheckout = async (
  priceId: string,
  userId: string,
  userEmail: string
): Promise<void> => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe não inicializado');
    }

    const sessionId = await createCheckoutSession(priceId, userId, userEmail);
    if (!sessionId) {
      throw new Error('Erro ao criar sessão de checkout');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Erro ao redirecionar para checkout:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro no processo de checkout:', error);
    throw error;
  }
};

/**
 * Calcula o custo em créditos de uma operação
 */
export const calculateCredits = (
  operation: 'inpainting' | 'outpainting' | 'object_removal' | 'style_transfer',
  quality: 'standard' | 'hd' | '4k' | '8k' = 'standard'
): number => {
  const baseCosts = {
    inpainting: 1,
    outpainting: 2,
    object_removal: 1,
    style_transfer: 3,
  };

  const qualityMultipliers = {
    standard: 1,
    hd: 2,
    '4k': 4,
    '8k': 8,
  };

  return baseCosts[operation] * qualityMultipliers[quality];
};
