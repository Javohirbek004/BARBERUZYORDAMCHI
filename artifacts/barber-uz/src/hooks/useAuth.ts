import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGetCurrentUser, useLogoutUser } from '@workspace/api-client-react';

export function useAuth(requireAuth = true) {
  const [, navigate] = useLocation();
  const { data: user, isLoading, error } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000, 
    }
  });

  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem('barber_token');
        navigate('/login');
      }
    }
  });

  useEffect(() => {
    if (requireAuth && !isLoading && (error || !user)) {
      navigate('/login');
    }
  }, [user, isLoading, error, requireAuth, navigate]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMutation.mutate()
  };
}
