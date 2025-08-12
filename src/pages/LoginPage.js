/**
 * Página de Login
 * Página completa de autenticação da aplicação
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Página de onde o usuário veio (para redirecionar após login)
  const from = location.state?.from || ROUTES.DASHBOARD;

  console.log('🔐 LoginPage - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Se já está autenticado, redirecionar
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('✅ Usuário já autenticado, redirecionando para:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Handler de sucesso no login
  const handleLoginSuccess = (result) => {
    console.log('🎉 Login realizado com sucesso, redirecionando para:', from);
    
    // Pequeno delay para melhor UX
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 500);
  };

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Carregando...</h2>
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se já autenticado, não mostrar a tela de login
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-transparent rotate-12 transform"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/10 to-transparent -rotate-12 transform"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm onSuccess={handleLoginSuccess} />
        
        {/* Informações adicionais */}
        <div className="mt-8 text-center space-y-4">
          {/* Mensagem de redirecionamento se veio de outra página */}
          {location.state?.from && location.state.from !== ROUTES.DASHBOARD && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-200">
              <p className="text-sm">
                Você será redirecionado para <strong>{location.state.from}</strong> após o login.
              </p>
            </div>
          )}

          {/* Links úteis ou informações */}
          <div className="text-xs text-gray-400 space-y-2">
            <p>Sistema de Gestão de Categorias</p>
            <p>© 2025 - Todos os direitos reservados</p>
          </div>
        </div>
      </div>

      {/* Padrão decorativo no fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-2/3 left-1/6 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/6 right-1/6 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

// Componente de página de login simplificada (para uso em modais ou embarcada)
export const EmbeddedLoginPage = ({ 
  onSuccess, 
  showBackground = false,
  className = ''
}) => {
  const backgroundClass = showBackground 
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
    : 'bg-transparent';

  return (
    <div className={`flex items-center justify-center p-4 ${backgroundClass} ${className}`}>
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
};

// Hook para usar lógica de login
export const useLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, error, clearError } = useAuth();

  const from = location.state?.from || ROUTES.DASHBOARD;

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      if (result.success) {
        navigate(from, { replace: true });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const redirectIfAuthenticated = () => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return true;
    }
    return false;
  };

  return {
    handleLogin,
    redirectIfAuthenticated,
    from,
    error,
    clearError,
    isAuthenticated
  };
};

export default LoginPage;