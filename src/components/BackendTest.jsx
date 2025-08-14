import { useState, useEffect } from 'react';

const BackendTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log('🧪 Simple backend test starting...');
        
        const response = await fetch('https://smdb-movie-app.onrender.com/api/health');
        console.log('🧪 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🧪 Backend response:', data);
          setStatus('✅ Backend is working!');
        } else {
          setStatus('❌ Backend returned error');
          setError(`Status: ${response.status}`);
        }
      } catch (err) {
        console.error('🧪 Backend test failed:', err);
        setStatus('❌ Backend connection failed');
        setError(err.message);
      }
    };

    testBackend();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#333', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Backend Test: {status}</div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

export default BackendTest;
