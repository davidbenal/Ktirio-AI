import React from 'react';

interface CreditsWidgetProps {
  total: number;
  remaining: number;
  resetDate: string;
  onUpgrade: () => void;
}

const CreditsWidget: React.FC<CreditsWidgetProps> = ({
  total,
  remaining,
  resetDate,
  onUpgrade,
}) => {
  const percentage = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="mt-auto pt-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="text-sm font-semibold text-gray-900">Créditos</span>
          </div>
          <button
            onClick={onUpgrade}
            className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Upgrade
          </button>
        </div>

        {/* Credits Info */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Total:</span>
            <span className="font-semibold text-gray-900">
              {total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Restantes:</span>
            <span className="font-semibold text-gray-900">
              {remaining.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Reset Date */}
        <p className="text-[11px] text-gray-400 text-center">
          Reinicia em {resetDate}
        </p>
      </div>
    </div>
  );
};

export default CreditsWidget;
