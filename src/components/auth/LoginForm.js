/**
 * Componente LoginForm
 * Formulário de autenticação da aplicação
 */

import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { InlineNotification } from '../common/Toast';
import { config } from '../../utils/config';
import { TOAST_TYPES, CSS_CLASSES } from '../../utils/constants';

const LoginForm = ({ onSuccess, className = '' }) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Hook de autenticação
  const { login, error: authError, clearError, isLoading } = useAuth();

  // Limpar erro quando componente desmonta ou dados mudam
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearError]);

  // Validação local do formulário
  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      errors.username = 'Username deve ter pelo menos 3 caracteres';
    }

    if (!formData.password) {
      errors.password = 'Password é obrigatório';
    } else if (formData.password.length < 4) {
      errors.password = 'Password deve ter pelo menos 4 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro específico do campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpar erro geral se existe
    if (authError) {
      clearError();
    }
  };

  // Handle submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔐 Tentando fazer login...');
      
      const result = await login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        console.log('✅ Login realizado com sucesso');
        
        // Limpar formulário
        setFormData({ username: '', password: '' });
        
        // Callback de sucesso
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle senha
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const isLoading_local = isSubmitting || isLoading;
  const canSubmit = formData.username.trim() && formData.password && !isLoading_local;

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Tag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{config.dashboard.name}</h1>
        <p className="text-gray-300">Faça login para continuar</p>
        <p className="text-xs text-gray-400 mt-2">v{config.dashboard.version} | API {config.api.version}</p>
      </div>
      
      {/* Erro Global */}
      {authError && (
        <div className="mb-6">
          <InlineNotification
            message={authError}
            type={TOAST_TYPES.ERROR}
            showIcon={true}
            showClose={true}
            onClose={clearError}
          />
        </div>
      )}
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`
              w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-colors
              ${formErrors.username 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-white/20'
              }
            `}
            placeholder="Digite seu username"
            disabled={isLoading_local}
            autoComplete="username"
          />
          {formErrors.username && (
            <p className="mt-2 text-sm text-red-300">{formErrors.username}</p>
          )}
        </div>

        {/* Campo Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`
                w-full px-4 py-3 pr-12 bg-white/10 border rounded-lg text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-colors
                ${formErrors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-white/20'
                }
              `}
              placeholder="Digite sua senha"
              disabled={isLoading_local}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              disabled={isLoading_local}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-2 text-sm text-red-300">{formErrors.password}</p>
          )}
        </div>

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`
            w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg 
            font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 
            flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
            ${isLoading_local ? 'cursor-wait' : ''}
          `}
        >
          {isLoading_local ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Entrar
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Desenvolvido para gestão de categorias
        </p>
      </div>
    </div>
  );
};

// Versão simplificada para uso em modais
export const SimpleLoginForm = ({ onSubmit, loading = false }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(credentials);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
        className={CSS_CLASSES.INPUT.DEFAULT}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        className={CSS_CLASSES.INPUT.DEFAULT}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !credentials.username || !credentials.password}
        className={CSS_CLASSES.BUTTON.PRIMARY}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;