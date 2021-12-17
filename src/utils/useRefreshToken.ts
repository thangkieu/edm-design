import { useCallback, useState } from 'react';

export const useRefreshToken = (): [string, () => void] => {
  const [token, setToken] = useState(Date.now());

  const refreshToken = useCallback(() => {
    setToken(Date.now());
  }, []);

  return [token?.toString(), refreshToken];
};
