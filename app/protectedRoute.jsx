"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Loader from './Components/Loader';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    if (isLoggedIn === undefined) return; // Auth context not ready yet

    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectPath', currentPath);
      router.push('/login');
      return;
    }

    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => user?.roles?.includes(role));
      if (!hasRole) {
        setAuthStatus('unauthorized');
        return;
      }
    }

    setAuthStatus('authorized');
  }, [isLoggedIn, user, requiredRoles, router]);

  if (authStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader size="lg" />
        <p className="mt-4 text-gray-600">Verifying your credentials...</p>
      </div>
    );
  }

  if (authStatus === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You don't have permission to view this page
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;