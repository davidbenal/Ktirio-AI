import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useCredits } from '../contexts/CreditsContext';
import { PLANS, PricingPlan, redirectToCheckout } from '../services/stripeService';

const PricingPage: React.FC = () => {
  const { user } = useUser();
  const { plan: currentPlan, credits, subscriptionStatus } = useCredits();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) return;

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) return;

    setLoading(plan);
    
    try {
      await redirectToCheckout(
        planConfig.priceId,
        user.id,
        user.primaryEmailAddress?.emailAddress || ''
      );
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600">
            Créditos atuais: <span className="font-bold text-blue-600">{credits}</span>
          </p>
          {currentPlan !== PricingPlan.FREE && (
            <p className="text-sm text-gray-500 mt-2">
              Plano atual: <span className="font-semibold">{PLANS[currentPlan].name}</span>
              {subscriptionStatus && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {subscriptionStatus}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(PLANS).map(([key, planConfig]) => {
            const planKey = key as PricingPlan;
            const isCurrentPlan = currentPlan === planKey;
            const isFree = planKey === PricingPlan.FREE;

            return (
              <div
                key={planKey}
                className={`
                  relative rounded-2xl border-2 p-8 transition-all
                  ${isCurrentPlan 
                    ? 'border-blue-500 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }
                  ${planKey === PricingPlan.PRO ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-white'}
                `}
              >
                {/* Badge de Plano Atual */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Plano Atual
                    </span>
                  </div>
                )}

                {/* Badge Recomendado */}
                {planKey === PricingPlan.PRO && !isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Recomendado
                    </span>
                  </div>
                )}

                {/* Conteúdo do Card */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {planConfig.name}
                  </h3>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {planConfig.price.toFixed(2)}
                    </span>
                    {!isFree && (
                      <span className="text-gray-500 ml-2">/mês</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {planConfig.credits === -1 
                      ? 'Ilimitado' 
                      : `${planConfig.credits} créditos`}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {planConfig.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => !isFree && !isCurrentPlan && handleSubscribe(planKey)}
                  disabled={isCurrentPlan || loading === planKey}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold transition-all
                    ${isCurrentPlan
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isFree
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : planKey === PricingPlan.PRO
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                    ${loading === planKey ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {loading === planKey ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processando...
                    </span>
                  ) : isCurrentPlan ? (
                    'Plano Atual'
                  ) : isFree ? (
                    'Plano Gratuito'
                  ) : (
                    'Assinar Agora'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ ou informações adicionais */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            Todos os planos incluem acesso completo às ferramentas de IA de staging virtual.
            <br />
            Você pode cancelar sua assinatura a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
