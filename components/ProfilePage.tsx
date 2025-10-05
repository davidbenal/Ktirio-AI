import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../contexts/CreditsContext';
import { PLANS } from '../services/stripeService';

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { credits, plan, subscriptionStatus, lastReset } = useCredits();
  const [loading, setLoading] = useState(false);

  const currentPlan = PLANS[plan as keyof typeof PLANS] || PLANS.free;

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      // TODO: Implementar createPortalSession quando o backend estiver pronto
      const functionsUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL ||
                           'http://localhost:5001/ktirio-ai-4540c/us-central1';

      const response = await fetch(`${functionsUrl}/createPortalSession`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao abrir portal de assinatura:', error);
      alert('Erro ao abrir portal. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (!subscriptionStatus) return null;

    const statusConfig: Record<string, { color: string; text: string }> = {
      active: { color: 'bg-green-100 text-green-800', text: 'Ativo' },
      past_due: { color: 'bg-orange-100 text-orange-800', text: 'Pagamento Pendente' },
      canceled: { color: 'bg-red-100 text-red-800', text: 'Cancelado' },
      trialing: { color: 'bg-blue-100 text-blue-800', text: 'Em Teste' },
    };

    const config = statusConfig[subscriptionStatus] || { color: 'bg-gray-100 text-gray-800', text: subscriptionStatus };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/gallery')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Perfil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-24 h-24 rounded-full border-4 border-blue-100 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4 border-4 border-blue-100">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {user?.fullName || 'Usuário'}
                </h2>
                <p className="text-sm text-gray-500 text-center mt-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

              {/* User Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Membro desde</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(user?.createdAt?.toString())}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">ID do usuário</span>
                  <span className="text-xs font-mono text-gray-500">
                    {user?.id?.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Credits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Plano {currentPlan.name}
                  </h3>
                  {getStatusBadge()}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    R$ {currentPlan.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">por mês</p>
                </div>
              </div>

              {/* Plan Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Créditos Mensais</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentPlan.credits === -1 ? '∞' : currentPlan.credits}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Créditos Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">{credits}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Recursos incluídos:</p>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
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
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {plan !== 'free' ? (
                  <button
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Carregando...' : 'Gerenciar Assinatura'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Fazer Upgrade
                  </button>
                )}
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Ver Todos os Planos
                </button>
              </div>
            </div>

            {/* Credits Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informações de Créditos</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Última renovação</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(lastReset)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Próxima renovação</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {lastReset ? formatDate(new Date(new Date(lastReset).setMonth(new Date(lastReset).getMonth() + 1)).toISOString()) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-600">Créditos usados este mês</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {currentPlan.credits === -1 ? 'N/A' : currentPlan.credits - credits}
                  </span>
                </div>
              </div>

              {/* Usage Bar */}
              {currentPlan.credits !== -1 && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Uso mensal</span>
                    <span>{Math.round((credits / currentPlan.credits) * 100)}% restante</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                      style={{ width: `${(credits / currentPlan.credits) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
