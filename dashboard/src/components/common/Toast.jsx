/**
 * Componente de Toast/Notificações
 * Sistema visual de notificações para toda a aplicação
 */

import React from 'react';
import { CheckCircle, AlertCircle, X, AlertTriangle, Info } from 'lucide-react';
import { TOAST_TYPES } from '../../utils/constants';

// Componente individual de toast
const ToastItem = ({ toast, onRemove }) => {
  const { id, message, type, createdAt } = toast;

  // Configurações visuais por tipo
  const toastConfig = {
    [TOAST_TYPES.SUCCESS]: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    [TOAST_TYPES.ERROR]: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    [TOAST_TYPES.WARNING]: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    [TOAST_TYPES.INFO]: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = toastConfig[type] || toastConfig[TOAST_TYPES.INFO];
  const IconComponent = config.icon;

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border 
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        animate-in slide-in-from-top-2 duration-300
        min-w-[300px] max-w-[500px]
      `}
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      
      <span className="font-medium flex-1">{message}</span>
      
      <button 
        onClick={() => onRemove(id)}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Container principal de toasts
const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

// Componente principal exportado
const Toast = ({ toasts, onRemove }) => {
  return <ToastContainer toasts={toasts} onRemove={onRemove} />;
};

// Componente conectado com hook (versão mais conveniente)
export const ToastProvider = ({ children }) => {
  // Este será usado no contexto principal da app
  return (
    <>
      {children}
      {/* O ToastContainer será renderizado através do hook useToast */}
    </>
  );
};

// Hook personalizado para renderizar toasts em qualquer lugar
export const useToastRenderer = () => {
  const ToastRenderer = ({ toasts, onRemove }) => (
    <Toast toasts={toasts} onRemove={onRemove} />
  );
  
  return ToastRenderer;
};

// Componente de toast simples para uso direto
export const SimpleToast = ({ message, type = TOAST_TYPES.INFO, onClose }) => {
  const toast = {
    id: 'simple',
    message,
    type,
    createdAt: Date.now()
  };

  return (
    <ToastItem 
      toast={toast} 
      onRemove={() => onClose && onClose()} 
    />
  );
};

// Componente de notificação inline (não flutuante)
export const InlineNotification = ({ 
  message, 
  type = TOAST_TYPES.INFO, 
  showIcon = true,
  showClose = false,
  onClose,
  className = ''
}) => {
  const toastConfig = {
    [TOAST_TYPES.SUCCESS]: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    [TOAST_TYPES.ERROR]: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    [TOAST_TYPES.WARNING]: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    [TOAST_TYPES.INFO]: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = toastConfig[type] || toastConfig[TOAST_TYPES.INFO];
  const IconComponent = config.icon;

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border 
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        ${className}
      `}
    >
      {showIcon && (
        <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      )}
      
      <span className="font-medium flex-1">{message}</span>
      
      {showClose && onClose && (
        <button 
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;