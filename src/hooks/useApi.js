import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React Hook for API Data Fetching & Error State Management
 * 
 * Manages loading, data, error states, and retry capabilities.
 */
export function useApi(apiFn, deps = [], initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      console.error('[useApi Error]:', err);
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [apiFn]);

  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    setError(null);
    
    apiFn()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

export default useApi;
