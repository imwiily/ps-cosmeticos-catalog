import React, { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingComponents';
import { useProdutos, useCategorias } from '../hooks/useApi';

const HomePage = ({ onProductClick, onNavigateToProducts }) => {
  // Hooks da API - apenas produtos em destaque (primeiros 8)
  const { 
    produtos: produtosDestaque, 
    loading: produtosLoading, 
    error: produtosError 
  } = useProdutos("Todos", "Todas", 0, 8);
  
  const { 
    categorias, 
    loading: categoriasLoading, 
    error: categoriasError 
  } = useCategorias();

  const handleCategoryClick = (categoria) => {
    // Navegar para página de produtos com categoria selecionada
    onNavigateToProducts({ categoria });
  };

  const handleViewAllProducts = () => {
    // Navegar para página de produtos
    onNavigateToProducts();
  };

  // Se há erro crítico nas categorias, mostrar tela de erro
  if (categoriasError && !categorias.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center">
        <ErrorMessage 
          error="Não foi possível carregar as categorias" 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header />
      <HeroSection />
      
      {/* Seção de Categorias - Visual/Showcase */}
      {categoriasLoading ? (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl font-serif text-amber-800 text-center mb-12">Carregando Categorias...</h3>
            <LoadingSpinner size="xl" className="py-8" />
          </div>
        </section>
      ) : (
        <CategoriesSection 
          categorias={categorias}
          onCategoryClick={handleCategoryClick} 
        />
      )}
      
      {/* Seção de Produtos em Destaque */}
      <FeaturedProductsSection 
        produtos={produtosDestaque}
        onProductClick={onProductClick}
        onViewAllClick={handleViewAllProducts}
        loading={produtosLoading}
        error={produtosError}
      />
      
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;