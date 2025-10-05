import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCredits } from '../contexts/CreditsContext';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { credits, plan } = useCredits();
  const [countdown, setCountdown] = useState(5);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Countdown para redirecionar
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/gallery');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-500"
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
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado! 🎉
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Sua assinatura foi ativada com sucesso. Você já pode começar a usar seus créditos!
          </p>

          {/* Plan Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plano Ativo</p>
                <p className="text-2xl font-bold text-blue-600 capitalize">
                  {plan || 'Carregando...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Créditos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {credits || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Session ID (for debugging/support) */}
          {sessionId && (
            <div className="mb-6">
              <p className="text-xs text-gray-400">
                ID da sessão: {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Redirecionando em {countdown} segundos...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/gallery')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Começar Agora
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
            >
              Ver Perfil
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Um email de confirmação foi enviado para você.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Dúvidas? Entre em contato com nosso{' '}
            <a href="mailto:suporte@ktirio.ai" className="text-blue-600 hover:underline">
              suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
