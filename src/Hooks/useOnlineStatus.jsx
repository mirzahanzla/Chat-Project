import { useState, useEffect } from 'react';

const useOnlineStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Clear all errors when page changes
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup the event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};

export default useOnlineStatus;
