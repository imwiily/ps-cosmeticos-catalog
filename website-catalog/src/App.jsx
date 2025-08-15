// src/App.jsx - COM SUPORTE À NAVEGAÇÃO DO NAVEGADOR
import React, { useState, useEffect } from 'react';
import { LoadingOverlay } from './components/ui/LoadingComponents';
import { useCustomStyles } from './utils/helpers';
import { useCatalogNavigation } from './hooks/useCatalogNavigation.jsx';
import { useBrowserNavigation } from './hooks/useBrowserNavigation.jsx';

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

  // Hook para gerenciar navegação do navegador
  const {
    updateUrl,
    parseCurrentUrl,
    navigateToHomeWithHistory,
    navigateToCategoriesWithHistory,
    navigateToSubcategoriesWithHistory,
    navigateToProductsWithHistory,
    navigateToProductWithHistory
  } = useBrowserNavigation(currentPage, {
    navigateToHome,
    navigateToCategories,
    navigateToProducts,
    navigateToSubcategories,
    selectedCategory,
    selectedSubcategory,
    selectedProduct,
    setSelectedProduct
  });

  // Adiciona estilos customizados
  useCustomStyles();

  // Inicializar com base na URL atual
  useEffect(() => {
    const urlParams = parseCurrentUrl();
    
    // Se há parâmetros na URL, inicializar a aplicação baseado neles
    if (urlParams.page !== 'home') {
      // Aqui você pode implementar a lógica para carregar o estado inicial
      // baseado nos parâmetros da URL se necessário
    }
  }, [parseCurrentUrl]);

  // Filtrar subcategorias baseado na categoria selecionada
  const getSubcategoriasFiltradas = () => {
    if (!selectedCategory || !subcategorias.length) {
      return [];
    }

    const subcategoriasFiltradas = subcategorias.filter(sub => {
      // Verificar se sub.categoria existe e tem o campo nome
      if (!sub || !sub.categoria) {
        return false;
      }

      // Verificar se categoria.nome existe antes de chamar toLowerCase
      const categoriaNome = sub.categoria.nome || sub.categoria.name || '';
      const selectedCategoryNome = selectedCategory.nome || '';

      if (!categoriaNome || !selectedCategoryNome) {
        return false;
      }

      const match = categoriaNome.toLowerCase() === selectedCategoryNome.toLowerCase();
      
      return match;
    });

    return subcategoriasFiltradas;
  };

  // Handler para seleção de categoria
  const handleCategorySelect = async (categoria) => {
    setIsTransitioning(true);
    
    try {
      // Verificar se subcategorias estão carregadas antes de filtrar
      if (subcategoriasLoading) {
        // Se subcategorias ainda estão carregando, ir direto para produtos
        navigateToProductsWithHistory(categoria);
        return;
      }

      // Verificar se a categoria tem subcategorias
      const subcategoriasDisponiveis = subcategorias.filter(sub => {
        // Verificação mais robusta
        if (!sub || !sub.categoria) return false;
        
        const categoriaNome = sub.categoria.nome || sub.categoria.name || '';
        const selectedCategoryNome = categoria.nome || '';
        
        return categoriaNome && selectedCategoryNome && 
               categoriaNome.toLowerCase() === selectedCategoryNome.toLowerCase();
      });

      if (subcategoriasDisponiveis.length > 0) {
        // Navegar para subcategorias
        navigateToSubcategoriesWithHistory(categoria);
      } else {
        // Ir direto para produtos
        navigateToProductsWithHistory(categoria);
      }
    } catch (error) {
      // Em caso de erro, ir direto para produtos
      navigateToProductsWithHistory(categoria);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handler para seleção de subcategoria
  const handleSubcategorySelect = async (subcategoria) => {
    setIsTransitioning(true);
    
    try {
      navigateToProductsWithHistory(selectedCategory, subcategoria);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handler para visualizar todos os produtos de uma categoria
  const handleViewAllProducts = async () => {
    setIsTransitioning(true);
    
    try {
      navigateToProductsWithHistory(selectedCategory);
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
        const produtoApi = await apiService.getProdutoPorId(produto.id);
        if (produtoApi) {
          produtoCompleto = apiService.transformProdutoData(produtoApi);
        }
      }

      // Usar a função com histórico
      navigateToProductWithHistory(produtoCompleto, selectedCategory, selectedSubcategory);
    } catch (error) {
      navigateToProductWithHistory(produto, selectedCategory, selectedSubcategory);
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
            navigateToHomeWithHistory();
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
            onBackToHome={navigateToHomeWithHistory}
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
            onBackToCategories={navigateToCategoriesWithHistory}
            onBackToHome={navigateToHomeWithHistory}
            loading={subcategoriasLoading}
            error={subcategoriasError}
          />
        );

      case 'products':
        return (
          <ProductsPage
            onProductClick={handleProductClick}
            onBackToHome={navigateToHomeWithHistory}
            initialFilters={{
              categoria: selectedCategory?.nome || 'Todos',
              subcategoria: selectedSubcategory?.nome || 'Todas'
            }}
            breadcrumbPath={getBreadcrumbPath()}
            onNavigateToCategories={navigateToCategoriesWithHistory}
            onNavigateToSubcategories={() => navigateToSubcategoriesWithHistory(selectedCategory)}
          />
        );

      default: // 'home'
        return (
          <CatalogHomePage
            onNavigateToCategories={navigateToCategoriesWithHistory}
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