/**
 * Context de Autenticação
 * Gerencia estado global de autenticação
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService_local } from '../services/auth';
import { MESSAGES } from '../utils/constants';

// Estados de autenticação
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Ações do reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
  state: AUTH_STATES.LOADING
};

// Reducer para gerenciar estado de autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
        state: AUTH_STATES.LOADING
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        state: AUTH_STATES.AUTHENTICATED
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload.error,
        state: AUTH_STATES.ERROR
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null,
        state: AUTH_STATES.UNAUTHENTICATED
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: action.payload.success,
        isLoading: false,
        token: action.payload.token || null,
        error: null,
        state: action.payload.success ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        state: state.isAuthenticated ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED
      };

    default:
      return state;
  }
};

// Criar o Context
const AuthContext = createContext();

// Provider do Context
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Tentar restaurar sessão ao inicializar
  useEffect(() => {
    const restoreSession = async () => {
      console.log('🔄 AuthContext: Tentando restaurar sessão...');
      
      try {
        const result = await authService_local.restoreSession();
        
        console.log('📋 AuthContext: Resultado da restauração:', result);
        
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: result
        });
        
        if (result.success) {
          console.log('✅ AuthContext: Sessão restaurada com sucesso');
        } else {
          console.log('❌ AuthContext: Nenhuma sessão válida encontrada');
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro ao restaurar sessão:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { success: false }
        });
      }
    };

    restoreSession();
  }, []);

  // Ações disponíveis
  const actions = {
    /**
     * Fazer login
     */
    async login(credentials) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING });

      try {
        console.log('🔐 AuthContext: Iniciando login...');
        
        const result = await authService_local.login(credentials);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            token: result.token
          }
        });

        console.log('✅ AuthContext: Login realizado com sucesso');
        return { success: true };

      } catch (error) {
        console.error('❌ AuthContext: Erro no login:', error.message);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: {
            error: error.message
          }
        });

        return { 
          success: false, 
          error: error.message 
        };
      }
    },

    /**
     * Fazer logout
     */
    logout() {
      console.log('🚪 AuthContext: Fazendo logout...');
      
      authService_local.logout();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      console.log('✅ AuthContext: Logout realizado');
    },

    /**
     * Limpar erro
     */
    clearError() {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    },

    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
      const currentAuthState = state.isAuthenticated && authService_local.isAuthenticated();
      console.log('🔍 AuthContext.isAuthenticated() chamado:', {
        stateAuthenticated: state.isAuthenticated,
        serviceAuthenticated: authService_local.isAuthenticated(),
        result: currentAuthState
      });
      return currentAuthState;
    },

    /**
     * Obter token atual
     */
    getToken() {
      return state.token || authService_local.getCurrentToken();
    }
  };

  // Valor do contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Ações
    ...actions,
    
    // Estados calculados
    isReady: !state.isLoading,
    hasError: !!state.error,
    
    // Estados específicos
    isLoading: state.isLoading,
    isLoggedIn: state.isAuthenticated,
    isAuthenticated: state.isAuthenticated, // Usar diretamente do state
    
    // Helpers
    authState: state.state
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// Hook para verificar se está carregando
export const useAuthLoading = () => {
  const { isLoading } = useAuth();
  return isLoading;
};

// Hook para verificar se está autenticado
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Exportar estados para uso externo
export { AUTH_STATES };