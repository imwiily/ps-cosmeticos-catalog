/**
 * Componente ProtectedRoute
 * Rota que requer autenticação para acesso
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingWithText, FullPageSkeleton } from './LoadingSkeleton';
import { ROUTES } from '../../utils/constants';

// Componente de loading para verificação de autenticação
const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-xl font-bold text-white mb-4">Verificando Acesso</h2>
      <p className="text-gray-300 mb-8">Aguarde enquanto verificamos suas credenciais...</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  </div>
);

// Componente principal de rota protegida
const ProtectedRoute = ({ 
  children, 
  redirectTo = ROUTES.LOGIN,
  fallback = <AuthLoadingScreen />,
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, isReady } = useAuth();
  const location = useLocation();

  // Ainda carregando autenticação
  if (!isReady || isLoading) {
    return fallback;
  }

  // Se requer autenticação mas não está autenticado
  if (requireAuth && !isAuthenticated) {
    console.log('🚫 Acesso negado - redirecionando para login');
    // Salvar a rota atual para redirecionar após login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Se não requer autenticação mas está autenticado (ex: página de login)
  if (!requireAuth && isAuthenticated) {
    console.log('✅ Já autenticado - redirecionando para dashboard');
    return (
      <Navigate 
        to={ROUTES.DASHBOARD} 
        replace 
      />
    );
  }

  // Permitir acesso
  return children;
};

// Componente para rotas que requerem autenticação
export const RequireAuth = ({ children, fallback }) => (
  <ProtectedRoute requireAuth={true} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

// Componente para rotas que NÃO devem ser acessadas quando autenticado (ex: login)
export const RequireNoAuth = ({ children, fallback }) => (
  <ProtectedRoute requireAuth={false} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

// HOC para proteger componentes
export const withAuth = (Component, options = {}) => {
  const { 
    requireAuth = true, 
    redirectTo = ROUTES.LOGIN,
    fallback = <AuthLoadingScreen />
  } = options;

  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute 
        requireAuth={requireAuth}
        redirectTo={redirectTo}
        fallback={fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook para verificar permissões de rota
export const useRouteAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const canAccess = (routeRequiresAuth = true) => {
    if (isLoading) return null; // Ainda verificando
    return routeRequiresAuth ? isAuthenticated : !isAuthenticated;
  };

  const shouldRedirect = (routeRequiresAuth = true) => {
    const access = canAccess(routeRequiresAuth);
    if (access === null) return false; // Ainda verificando
    return !access;
  };

  const getRedirectPath = (routeRequiresAuth = true) => {
    if (routeRequiresAuth) {
      return ROUTES.LOGIN;
    } else {
      // Se está logado mas tentando acessar login, vai para dashboard
      return ROUTES.DASHBOARD;
    }
  };

  return {
    canAccess,
    shouldRedirect,
    getRedirectPath,
    currentPath: location.pathname,
    isLoading
  };
};

// Componente para layout com autenticação
export const AuthLayout = ({ children, fallback = <FullPageSkeleton /> }) => {
  return (
    <RequireAuth fallback={fallback}>
      {children}
    </RequireAuth>
  );
};

// Componente para layout público (sem autenticação)
export const PublicLayout = ({ children, fallback = <AuthLoadingScreen /> }) => {
  return (
    <RequireNoAuth fallback={fallback}>
      {children}
    </RequireNoAuth>
  );
};

export default ProtectedRoute;