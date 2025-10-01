import { useEffect, useState } from 'react';
import { db, storage, auth } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';

export const useFirebaseTest = () => {
  const [status, setStatus] = useState({
    firestore: 'testing...',
    storage: 'testing...',
    auth: 'testing...',
  });

  useEffect(() => {
    const testFirebase = async () => {
      // Test Firestore
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setStatus(prev => ({ ...prev, firestore: '✅ Connected' }));
        console.log('✅ Firestore: Connected successfully');
      } catch (error) {
        setStatus(prev => ({ ...prev, firestore: '❌ Error' }));
        console.error('❌ Firestore Error:', error);
      }

      // Test Storage
      try {
        const storageRef = ref(storage);
        await listAll(storageRef);
        setStatus(prev => ({ ...prev, storage: '✅ Connected' }));
        console.log('✅ Storage: Connected successfully');
      } catch (error) {
        setStatus(prev => ({ ...prev, storage: '❌ Error' }));
        console.error('❌ Storage Error:', error);
      }

      // Test Auth
      try {
        if (auth) {
          setStatus(prev => ({ ...prev, auth: '✅ Initialized' }));
          console.log('✅ Auth: Initialized successfully');
        }
      } catch (error) {
        setStatus(prev => ({ ...prev, auth: '❌ Error' }));
        console.error('❌ Auth Error:', error);
      }
    };

    testFirebase();
  }, []);

  return status;
};
