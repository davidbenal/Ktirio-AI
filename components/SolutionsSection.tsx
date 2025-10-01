import React from 'react';

export interface SolutionItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface SolutionsSectionProps {
  selectedSolutionId?: string;
  onSelectSolution: (solutionId: string) => void;
}

const solutions: SolutionItem[] = [
  {
    id: 'render-sketch',
    name: 'Render Sketch',
    description: 'Transforme sketches em renders fotorealísticos',
  },
  {
    id: 'home-staging',
    name: 'Home Staging',
    description: 'Mobilie ambientes vazios virtualmente',
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    description: 'Redesenhe interiores com IA',
  },
  {
    id: 'exterior',
    name: 'Exterior',
    description: 'Transforme fachadas e áreas externas',
  },
];

const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  selectedSolutionId,
  onSelectSolution,
}) => {
  return (
    <div className="mt-6">
      <div className="border-t border-gray-100 pt-4 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
          Soluções
        </h3>
      </div>
      <ul>
        {solutions.map((solution) => {
          const isActive = selectedSolutionId === solution.id;

          return (
            <li key={solution.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSolution(solution.id);
                }}
                className={`group flex items-center justify-between gap-3 px-3 py-2.5 mx-2 text-sm rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={solution.description}
              >
                <span className="flex-1">{solution.name}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectSolution(solution.id);
                  }}
                  className={`
                    text-xs px-3 py-1 rounded-md border transition-all
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                    ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  {isActive ? 'Ativo' : 'Iniciar'}
                </button>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SolutionsSection;
