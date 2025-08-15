/**
 * Serviço de Autenticação
 * Gerencia login, logout e estado de autenticação
 */

import { config } from '../utils/config';
import { authService } from './api';
import { MESSAGES } from '../utils/constants';

/**
 * Gerenciador de Token
 */
export const tokenManager = {
  /**
   * Salvar token no localStorage
   */
  saveToken(token) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(config.auth.tokenKey, token);
    }
  },

  /**
   * Recuperar token do localStorage
   */
  getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(config.auth.tokenKey);
    }
    return null;
  },

  /**
   * Remover token do localStorage
   */
  removeToken() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(config.auth.tokenKey);
    }
  },

  /**
   * Verificar se token existe
   */
  hasToken() {
    return !!this.getToken();
  }
};

/**
 * Validações de autenticação
 */
export const authValidation = {
  /**
   * Validar dados de login
   */
  validateLoginData(loginData) {
    const errors = [];

    if (!loginData.username || loginData.username.trim() === '') {
      errors.push('Username é obrigatório');
    }

    if (!loginData.password || loginData.password.trim() === '') {
      errors.push('Password é obrigatório');
    }

    if (loginData.username && loginData.username.length < 3) {
      errors.push('Username deve ter pelo menos 3 caracteres');
    }

    if (loginData.password && loginData.password.length < 4) {
      errors.push('Password deve ter pelo menos 4 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validar formato do token
   */
  validateToken(token) {
    if (!token) return false;
    if (typeof token !== 'string') return false;
    if (token.trim().length === 0) return false;
    
    // Validação básica de JWT (3 partes separadas por ponto)
    const parts = token.split('.');
    return parts.length === 3;
  }
};

/**
 * Serviço principal de autenticação
 */
export const authService_local = {
  /**
   * Fazer login
   */
  async login(credentials) {
    console.log('🔐 Iniciando processo de login...');

    // Validar dados de entrada
    const validation = authValidation.validateLoginData(credentials);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      // Chamar API de login
      const response = await authService.login({
        username: credentials.username.trim(),
        password: credentials.password
      });

      // Validar token recebido
      if (!authValidation.validateToken(response.accessToken)) {
        throw new Error(MESSAGES.LOGIN.TOKEN_ERROR);
      }

      // Salvar token
      tokenManager.saveToken(response.accessToken);

      console.log('✅ Login realizado com sucesso');
      return {
        success: true,
        token: response.accessToken,
        user: response.user || null
      };

    } catch (error) {
      console.error('❌ Erro no login:', error.message);
      
      // Mapear erros para mensagens amigáveis
      let errorMessage = MESSAGES.LOGIN.ERROR;
      
      if (error.message.includes('conexão') || error.message.includes('NETWORK_ERROR')) {
        errorMessage = MESSAGES.LOGIN.CONNECTION_ERROR;
      } else if (error.message.includes('Token')) {
        errorMessage = MESSAGES.LOGIN.TOKEN_ERROR;
      } else if (error.message.includes('obrigatório') || error.message.includes('caracteres')) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  /**
   * Fazer logout
   */
  logout() {
    console.log('🚪 Fazendo logout...');
    
    tokenManager.removeToken();
    
    console.log('✅ Logout realizado');
    return {
      success: true
    };
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated() {
    const token = tokenManager.getToken();
    return authValidation.validateToken(token);
  },

  /**
   * Obter token atual
   */
  getCurrentToken() {
    return tokenManager.getToken();
  },

  /**
   * Verificar se token expirou (implementação básica)
   */
  isTokenExpired() {
    const token = tokenManager.getToken();
    
    if (!token) return true;

    try {
      // Decodificar payload do JWT sem verificar assinatura
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp < now;
    } catch (error) {
      console.warn('⚠️ Erro ao verificar expiração do token:', error);
      return true; // Se não conseguir verificar, considerar expirado
    }
  },

  /**
   * Renovar autenticação se token válido existir
   */
  async restoreSession() {
    console.log('🔄 Tentando restaurar sessão...');

    if (!this.isAuthenticated()) {
      console.log('❌ Nenhuma sessão válida encontrada');
      return { success: false };
    }

    if (this.isTokenExpired()) {
      console.log('❌ Token expirado');
      this.logout();
      return { success: false };
    }

    console.log('✅ Sessão restaurada com sucesso');
    return { 
      success: true, 
      token: this.getCurrentToken() 
    };
  }
};

/**
 * Hook personalizado para usar em componentes
 */
export const useAuthService = () => {
  return {
    login: authService_local.login,
    logout: authService_local.logout,
    isAuthenticated: authService_local.isAuthenticated,
    getCurrentToken: authService_local.getCurrentToken,
    restoreSession: authService_local.restoreSession,
    isTokenExpired: authService_local.isTokenExpired
  };
};