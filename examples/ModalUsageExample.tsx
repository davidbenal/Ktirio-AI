import React from 'react';
import { useConfirmModal } from '../hooks/useConfirmModal';
import { useModal } from '../contexts/ModalContext';

const ModalUsageExample: React.FC = () => {
  const { confirm, showAlert, confirmDelete } = useConfirmModal();
  const { showConfirmModal } = useModal();

  // Exemplo 1: Confirmação simples
  const handleSimpleConfirm = async () => {
    const confirmed = await confirm({
      message: 'Deseja continuar com esta ação?',
    });

    if (confirmed) {
      console.log('Usuário confirmou');
    } else {
      console.log('Usuário cancelou');
    }
  };

  // Exemplo 2: Confirmação de exclusão
  const handleDelete = async () => {
    const confirmed = await confirmDelete('Documento Importante');

    if (confirmed) {
      console.log('Item excluído');
    }
  };

  // Exemplo 3: Alerta simples (sem botão cancelar)
  const handleAlert = () => {
    showAlert({
      title: 'Sucesso!',
      message: 'Operação realizada com sucesso.',
      confirmText: 'Entendi',
      confirmButtonClass: 'bg-green-600 hover:bg-green-700 text-white',
    });
  };

  // Exemplo 4: Modal customizado com cores diferentes
  const handleCustomModal = () => {
    showConfirmModal({
      title: 'Atenção',
      message: 'Esta ação irá modificar permanentemente seus dados. Deseja prosseguir?',
      confirmText: 'Sim, prosseguir',
      cancelText: 'Não, voltar',
      confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      cancelButtonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
      onConfirm: () => {
        console.log('Ação confirmada');
      },
      onCancel: () => {
        console.log('Ação cancelada');
      },
    });
  };

  // Exemplo 5: Confirmação com ação assíncrona
  const handleAsyncAction = async () => {
    const confirmed = await confirm({
      title: 'Salvar Alterações',
      message: 'Deseja salvar todas as alterações realizadas?',
      confirmText: 'Salvar',
      cancelText: 'Descartar',
      confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    });

    if (confirmed) {
      try {
        // Simula uma operação assíncrona
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Alterações salvas com sucesso');
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Exemplos de Uso do Modal</h2>

      <button
        onClick={handleSimpleConfirm}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
      >
        Confirmação Simples
      </button>

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-4"
      >
        Confirmar Exclusão
      </button>

      <button
        onClick={handleAlert}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
      >
        Mostrar Alerta
      </button>

      <button
        onClick={handleCustomModal}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mr-4"
      >
        Modal Customizado
      </button>

      <button
        onClick={handleAsyncAction}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Ação Assíncrona
      </button>
    </div>
  );
};

export default ModalUsageExample;