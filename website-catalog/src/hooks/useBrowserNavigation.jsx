// src/hooks/useBrowserNavigation.jsx - Gerenciamento do histórico do navegador
import { useEffect, useCallback } from 'react';

export const useBrowserNavigation = (currentPage, navigationHandlers) => {
  const {
    navigateToHome,
    navigateToCategories, 
    navigateToProducts,
    navigateToSubcategories,
    selectedCategory,
    selectedSubcategory,
    selectedProduct,
    setSelectedProduct
  } = navigationHandlers;

  // Função para construir a URL baseada no estado atual
  const buildUrl = useCallback((page, category = null, subcategory = null, product = null) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    if (page !== 'home') {
      params.set('page', page);
    }
    
    if (category && category.nome !== 'Todos') {
      params.set('category', encodeURIComponent(category.nome));
    }
    
    if (subcategory && subcategory.nome !== 'Todas') {
      params.set('subcategory', encodeURIComponent(subcategory.nome));
    }
    
    if (product) {
      params.set('product', product.id);
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, []);

  // Função para atualizar a URL sem recarregar a página
  const updateUrl = useCallback((page, category = null, subcategory = null, product = null, replace = false) => {
    const url = buildUrl(page, category, subcategory, product);
    
    if (replace) {
      window.history.replaceState({ 
        page, 
        category, 
        subcategory, 
        product 
      }, '', url);
    } else {
      window.history.pushState({ 
        page, 
        category, 
        subcategory, 
        product 
      }, '', url);
    }
  }, [buildUrl]);

  // Função para lidar com o evento popstate (botão voltar/avançar do navegador)
  const handlePopState = useCallback((event) => {
    const state = event.state;
    
    if (!state) {
      // Se não há state, voltar para home
      navigateToHome();
      return;
    }

    const { page, category, subcategory, product } = state;

    // Navegar baseado no state
    switch (page) {
      case 'categories':
        navigateToCategories();
        break;
        
      case 'subcategories':
        if (category) {
          navigateToSubcategories(category);
        } else {
          navigateToCategories();
        }
        break;
        
      case 'products':
        navigateToProducts(category, subcategory);
        break;
        
      case 'product':
        if (product) {
          // Recriar o objeto produto básico para navegação
          setSelectedProduct(product);
        } else {
          navigateToProducts(category, subcategory);
        }
        break;
        
      default:
        navigateToHome();
        break;
    }
  }, [navigateToHome, navigateToCategories, navigateToSubcategories, navigateToProducts, setSelectedProduct]);

  // Função para parsear parâmetros da URL atual
  const parseCurrentUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: params.get('page') || 'home',
      category: params.get('category') ? decodeURIComponent(params.get('category')) : null,
      subcategory: params.get('subcategory') ? decodeURIComponent(params.get('subcategory')) : null,
      product: params.get('product') || null
    };
  }, []);

  // Hook para inicializar com base na URL atual
  useEffect(() => {
    const currentUrl = parseCurrentUrl();
    
    // Se há parâmetros na URL inicial, navegar baseado neles
    if (currentUrl.page !== 'home' || currentUrl.category || currentUrl.subcategory || currentUrl.product) {
      // Não fazer navegação automática na inicialização para evitar loops
      // A aplicação deve lidar com isso através dos initialFilters
    }
    
    // Adicionar listener para o botão voltar/avançar
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState, parseCurrentUrl]);

  // Retornar funções para serem usadas pelos componentes
  return {
    updateUrl,
    parseCurrentUrl,
    
    // Wrappers das funções de navegação que atualizam a URL
    navigateToHomeWithHistory: useCallback(() => {
      updateUrl('home');
      navigateToHome();
    }, [updateUrl, navigateToHome]),
    
    navigateToCategoriesWithHistory: useCallback(() => {
      updateUrl('categories');
      navigateToCategories();
    }, [updateUrl, navigateToCategories]),
    
    navigateToSubcategoriesWithHistory: useCallback((category) => {
      updateUrl('subcategories', category);
      navigateToSubcategories(category);
    }, [updateUrl, navigateToSubcategories]),
    
    navigateToProductsWithHistory: useCallback((category, subcategory) => {
      updateUrl('products', category, subcategory);
      navigateToProducts(category, subcategory);
    }, [updateUrl, navigateToProducts]),
    
    navigateToProductWithHistory: useCallback((product, category, subcategory) => {
      updateUrl('product', category, subcategory, product);
      setSelectedProduct(product);
    }, [updateUrl, setSelectedProduct]),
  };
};