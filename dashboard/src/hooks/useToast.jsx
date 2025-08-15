/**
 * Hook de Notificações (Toast)
 * Sistema de notificações para toda a aplicação
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { TOAST_TYPES, UI_CONFIG } from '../utils/constants';

// Toast global singleton
let globalToastState = {
  toasts: [],
  listeners: []
};

// Hook para gerenciar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState(globalToastState.toasts);
  const toastIdRef = useRef(0);

  // Sincronizar com estado global
  useEffect(() => {
    const listener = (newToasts) => {
      setToasts([...newToasts]);
    };
    
    globalToastState.listeners.push(listener);
    
    return () => {
      globalToastState.listeners = globalToastState.listeners.filter(l => l !== listener);
    };
  }, []);

  // Notificar todos os listeners
  const notifyListeners = () => {
    globalToastState.listeners.forEach(listener => listener(globalToastState.toasts));
  };

  // Gerar ID único para toast
  const generateId = useCallback(() => {
    toastIdRef.current += 1;
    return `toast_${Date.now()}_${toastIdRef.current}`;
  }, []);

  // Adicionar novo toast
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = UI_CONFIG.TOAST_DURATION) => {
    const id = generateId();
    
    const newToast = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now()
    };

    console.log('📢 Novo toast:', newToast);

    globalToastState.toasts.push(newToast);
    notifyListeners();

    // Auto-remover após duração especificada
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [generateId]);

  // Remover toast específico
  const removeToast = useCallback((id) => {
    console.log('🗑️ Removendo toast:', id);
    globalToastState.toasts = globalToastState.toasts.filter(toast => toast.id !== id);
    notifyListeners();
  }, []);

  // Limpar todos os toasts
  const clearAllToasts = useCallback(() => {
    console.log('🧹 Limpando todos os toasts');
    globalToastState.toasts = [];
    notifyListeners();
  }, []);

  // Funções específicas para cada tipo
  const showSuccess = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.SUCCESS, duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.ERROR, duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.INFO, duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.WARNING, duration);
  }, [addToast]);

  return {
    // Estado
    toasts,
    hasToasts: toasts.length > 0,
    
    // Ações gerais
    addToast,
    removeToast,
    clearAllToasts,
    
    // Ações específicas
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Aliases mais intuitivos
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning
  };
};

// Hook simplificado para componentes que só precisam mostrar toasts
export const useSimpleToast = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning
  };
};

// Hook para verificar se há toasts ativos
export const useHasToasts = () => {
  const { hasToasts } = useToast();
  return hasToasts;
};