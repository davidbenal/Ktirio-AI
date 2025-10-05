import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCredits } from '../contexts/CreditsContext';

const CancelPage: React.FC = () => {
  const navigate = useNavigate();
  const { credits, plan } = useCredits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Não se preocupe, você ainda pode assinar quando quiser!
          </p>

          {/* Current Plan Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-3">Seu Plano Atual</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Plano</p>
                <p className="text-lg font-bold text-gray-700 capitalize">
                  {plan || 'Free'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Créditos</p>
                <p className="text-lg font-bold text-gray-700">
                  {credits || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Why Upgrade Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Por que fazer upgrade?
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-xs text-gray-600">
                  Mais créditos para suas criações
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-xs text-gray-600">
                  Acesso prioritário ao suporte
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-xs text-gray-600">
                  Renderizações mais rápidas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span className="text-xs text-gray-600">
                  Recursos exclusivos
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Ver Planos Novamente
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
            >
              Voltar para Galeria
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Teve algum problema durante o pagamento?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Entre em contato com nosso{' '}
            <a href="mailto:suporte@ktirio.ai" className="text-blue-600 hover:underline">
              suporte
            </a>
            {' '}e teremos prazer em ajudar!
          </p>
        </div>

        {/* FAQ Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/pricing')}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Comparar todos os planos →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
