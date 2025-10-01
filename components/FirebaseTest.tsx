import React from 'react';
import { useFirebaseTest } from '../hooks/useFirebaseTest';

export const FirebaseTest: React.FC = () => {
  const status = useFirebaseTest();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      minWidth: '250px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold' }}>
        🔥 Firebase Status
      </h3>
      <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
        <div><strong>Firestore:</strong> {status.firestore}</div>
        <div><strong>Storage:</strong> {status.storage}</div>
        <div><strong>Auth:</strong> {status.auth}</div>
      </div>
      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>📋 Instruções:</strong><br/>
        Abra o Console (F12) para ver os logs detalhados
      </div>
    </div>
  );
};
