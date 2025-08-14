// src/components/ui/LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin`}
      />
    </div>
  );
};

// src/components/ui/ProductCardSkeleton.js
export const ProductCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
    <div className="aspect-[4/3] flex flex-col">
      <div className="relative flex-1">
        <div className="w-full aspect-square bg-gray-200 animate-pulse" />
        <div className="absolute top-3 left-3 bg-gray-200 animate-pulse rounded-full w-16 h-6" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-12" />
        </div>
      </div>
    </div>
    <div className="p-3 pt-0">
      <div className="h-8 bg-gray-200 animate-pulse rounded-full" />
    </div>
  </div>
);

// src/components/ui/CategoryCardSkeleton.js
export const CategoryCardSkeleton = () => (
  <div className="flex-none w-80 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
    <div className="w-full h-60 bg-gray-200 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
      </div>
      <div className="h-10 bg-gray-200 animate-pulse rounded-full" />
    </div>
  </div>
);

// src/components/ui/ErrorMessage.js
export const ErrorMessage = ({ 
  error, 
  onRetry, 
  title = "Ops! Algo deu errado", 
  className = "" 
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
      <div className="text-red-600 text-4xl mb-4">😔</div>
      <h3 className="text-xl font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">
        {error || 'Não foi possível carregar os dados. Tente novamente.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  </div>
);

// src/components/ui/EmptyState.js
export const EmptyState = ({ 
  title = "Nenhum produto encontrado", 
  description = "Tente ajustar os filtros ou navegue por outras categorias.", 
  icon = "🔍",
  className = "" 
}) => (
  <div className={`text-center py-16 ${className}`}>
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-serif text-amber-800 mb-2">{title}</h3>
    <p className="text-amber-600 max-w-md mx-auto">{description}</p>
  </div>
);

// src/components/ui/LoadingOverlay.js
export const LoadingOverlay = ({ isVisible, message = "Carregando..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-amber-800 font-medium">{message}</p>
      </div>
    </div>
  );
};