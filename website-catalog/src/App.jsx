// src/App.jsx - Versão Final com Sistema de Catálogo Hierárquico
import React, { useState } from 'react';
import { LoadingOverlay } from './components/ui/LoadingComponents';
import { useCustomStyles } from './utils/helpers';
import { useCatalogNavigation } from './hooks/useCatalogNavigation.jsx';

// Importar as novas páginas do catálogo
import CatalogHomePage from './pages/CatalogHomePage';
import CategoriesSelectionPage from './pages/CategoriesSelectionPage';
import SubcategoriesSelectionPage from './pages/SubcategoriesSelectionPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';

// Hooks da API
import { useCategorias, useSubcategorias } from './hooks/useApi';

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Sistema de navegação do catálogo
  const {
    currentPage,
    selectedCategory,
    selectedSubcategory,
    navigateToHome,
    navigateToCategories,
    navigateToSubcategories,
    navigateToProducts,
    getBreadcrumbPath
  } = useCatalogNavigation();

  // Hooks da API
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  const { subcategorias, loading: subcategoriasLoading, error: subcategoriasError } = useSubcategorias();

  // Adiciona estilos customizados
  useCustomStyles();

  // Filtrar subcategorias baseado na categoria selecionada
  const getSubcategoriasFiltradas = () => {
    if (!selectedCategory || !subcategorias.length) return [];
    return subcategorias.filter(sub => 
      sub.categoria?.toLowerCase() === selectedCategory.nome.toLowerCase()
    );
  };

  // Handler para seleção de categoria
  const handleCategorySelect = async (categoria) => {
    setIsTransitioning(true);
    
    try {
      // Verificar se a categoria tem subcategorias
      const subcategoriasDisponiveis = subcategorias.filter(sub => 
        sub.categoria?.toLowerCase() === categoria.nome.toLowerCase()
      );

      if (subcategoriasDisponiveis.length > 0) {
        // Navegar para subcategorias
        navigateToSubcategories(categoria);
      } else {
        // Ir direto para produtos
        navigateToProducts(categoria);
      }
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handler para seleção de subcategoria
  const handleSubcategorySelect = async (subcategoria) => {
    setIsTransitioning(true);
    
    try {
      navigateToProducts(selectedCategory, subcategoria);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handler para visualizar todos os produtos de uma categoria
  const handleViewAllProducts = async () => {
    setIsTransitioning(true);
    
    try {
      navigateToProducts(selectedCategory);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handler para clique em produto
  const handleProductClick = async (produto) => {
    setIsTransitioning(true);
    
    try {
      // Se o produto vem apenas com dados básicos, buscar dados completos
      let produtoCompleto = produto;
      
      if (!produto.descricaoCompleta || !produto.ingredientes) {
        const apiService = (await import('./services/api')).default;
        produtoCompleto = await apiService.getProdutoPorId(produto.id);
        produtoCompleto = apiService.transformProdutoData(produtoCompleto);
      }

      setSelectedProduct(produtoCompleto);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setSelectedProduct(produto);
    } finally {
      setIsTransitioning(false);
    }
  };

  // Handler para voltar dos detalhes do produto
  const handleBackFromProduct = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedProduct(null);
      setIsTransitioning(false);
    }, 300);
  };

  // Se estamos visualizando um produto específico
  if (selectedProduct) {
    return (
      <>
        <ProductDetailPage 
          product={selectedProduct}
          onBackToHome={() => {
            handleBackFromProduct();
            navigateToHome();
          }}
          onBackToProducts={() => {
            handleBackFromProduct();
          }}
          onProductClick={handleProductClick}
        />
        <LoadingOverlay 
          isVisible={isTransitioning} 
          message="Carregando produto..." 
        />
      </>
    );
  }

  // Renderização baseada na página atual do catálogo
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'categories':
        return (
          <CategoriesSelectionPage
            categorias={categorias}
            onCategorySelect={handleCategorySelect}
            onBackToHome={navigateToHome}
            loading={categoriasLoading}
            error={categoriasError}
          />
        );

      case 'subcategories':
        return (
          <SubcategoriesSelectionPage
            selectedCategory={selectedCategory}
            subcategorias={getSubcategoriasFiltradas()}
            onSubcategorySelect={handleSubcategorySelect}
            onViewAllProducts={handleViewAllProducts}
            onBackToCategories={navigateToCategories}
            onBackToHome={navigateToHome}
            loading={subcategoriasLoading}
            error={subcategoriasError}
          />
        );

      case 'products':
        return (
          <ProductsPage
            onProductClick={handleProductClick}
            onBackToHome={navigateToHome}
            initialFilters={{
              categoria: selectedCategory?.nome || 'Todos',
              subcategoria: selectedSubcategory?.nome || 'Todas'
            }}
            breadcrumbPath={getBreadcrumbPath()}
            onNavigateToCategories={navigateToCategories}
            onNavigateToSubcategories={() => navigateToSubcategories(selectedCategory)}
          />
        );

      default: // 'home'
        return (
          <CatalogHomePage
            onNavigateToCategories={navigateToCategories}
            categorias={categorias}
            loading={categoriasLoading}
            error={categoriasError}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentPage()}
      <LoadingOverlay 
        isVisible={isTransitioning} 
        message="Carregando..." 
      />
    </>
  );
};

export default App;