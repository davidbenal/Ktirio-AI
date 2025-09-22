
import React from 'react';
import AppRouter from './components/AppRouter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans text-gray-800">
      <AppRouter />
    </div>
  );
};

export default App;
