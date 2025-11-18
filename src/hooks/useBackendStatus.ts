import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

/**
 * Hook to detect if the backend API is available.
 * Makes a lightweight health check on mount.
 * 
 * @returns object with isBackendAvailable boolean and isChecking boolean
 */
export const useBackendStatus = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try to ping a lightweight endpoint
        // Assuming there's a health check or just try the base URL
        await apiClient.get('/health', { timeout: 3000 });
        setIsBackendAvailable(true);
      } catch (error) {
        console.warn('Backend health check failed, will use fallback data');
        setIsBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
  }, []);

  return { isBackendAvailable, isChecking };
};
