// src/components/ui/ProductErrorBoundary.js
import React from 'react';
import ProductCard from '../ProductCard';

// Componente para tratar erros em produtos individuais
export class ProductErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro no ProductCard:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <p className="text-red-700 text-sm">
            Erro ao carregar produto
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper seguro para ProductCard
export const SafeProductCard = ({ produto, onProductClick }) => {
  // Verificação rápida antes de renderizar
  if (!produto || !produto.nome) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <div className="text-gray-400 text-2xl mb-2">📦</div>
        <p className="text-gray-600 text-sm">
          Produto indisponível
        </p>
      </div>
    );
  }

  return (
    <ProductErrorBoundary>
      <ProductCard produto={produto} onProductClick={onProductClick} />
    </ProductErrorBoundary>
  );
};