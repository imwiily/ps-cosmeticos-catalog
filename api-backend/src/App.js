import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import { LoadingOverlay } from './components/ui/LoadingComponents';
import { useCustomStyles } from './utils/helpers';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [productsPageFilters, setProductsPageFilters] = useState({});

  // Adiciona estilos customizados
  useCustomStyles();

  const handleProductClick = async (produto) => {
    setIsTransitioning(true);
    
    try {
      // Se o produto vem apenas com dados básicos (lista), buscar dados completos
      let produtoCompleto = produto;
      
      if (!produto.descricaoCompleta || !produto.ingredientes) {
        const apiService = (await import('./services/api')).default;
        produtoCompleto = await apiService.getProdutoPorId(produto.id);
        produtoCompleto = apiService.transformProdutoData(produtoCompleto);
      }

      setSelectedProduct(produtoCompleto);
      setCurrentPage('product');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      // Em caso de erro, usar os dados básicos que temos
      setSelectedProduct(produto);
      setCurrentPage('product');
      window.scrollTo(0, 0);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage('home');
      setSelectedProduct(null);
      setProductsPageFilters({});
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToProducts = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage('products');
      setSelectedProduct(null);
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNavigateToProducts = (filters = {}) => {
    setIsTransitioning(true);
    setProductsPageFilters(filters);
    
    setTimeout(() => {
      setCurrentPage('products');
      setSelectedProduct(null);
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    }, 300);
  };

  // Renderização condicional baseada na página atual
  if (currentPage === 'product') {
    return (
      <>
        <ProductDetailPage 
          product={selectedProduct}
          onBackToHome={handleBackToHome}
          onBackToProducts={handleBackToProducts}
          onProductClick={handleProductClick}
        />
        <LoadingOverlay 
          isVisible={isTransitioning} 
          message="Carregando produto..." 
        />
      </>
    );
  }

  if (currentPage === 'products') {
    return (
      <>
        <ProductsPage 
          onProductClick={handleProductClick}
          onBackToHome={handleBackToHome}
          initialFilters={productsPageFilters}
        />
        <LoadingOverlay 
          isVisible={isTransitioning} 
          message="Carregando produtos..." 
        />
      </>
    );
  }

  return (
    <>
      <HomePage 
        onProductClick={handleProductClick}
        onNavigateToProducts={handleNavigateToProducts}
      />
      <LoadingOverlay 
        isVisible={isTransitioning} 
        message="Carregando..." 
      />
    </>
  );
};

export default App;