/**
 * Hook de Gerenciamento de Produtos - CORRIGIDO
 * Lógica completa para CRUD de produtos
 */

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';
import { MESSAGES, STATUS_FILTERS } from '../utils/constants';

export const useProducts = () => {
  // Estados
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Para relacionamento
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastFetch, setLastFetch] = useState(null);

  // Hooks
  const { getToken } = useAuth();
  const toast = useToast();

  // Cache simples - só busca se não buscou nos últimos 30 segundos
  const shouldFetch = useCallback(() => {
    if (!lastFetch) return true;
    const timeDiff = Date.now() - lastFetch;
    return timeDiff > 30000; // 30 segundos
  }, [lastFetch]);

  // Carregar produtos
  const fetchProducts = useCallback(async (force = false) => {
    // Se não deve buscar e não é forçado, retorna
    if (!force && !shouldFetch()) {
      console.log('📦 Cache válido, não buscando produtos');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('📦 Carregando produtos...');
      const token = getToken();
      const data = await productService.fetchProducts(token);
      
      setProducts(data);
      setLastFetch(Date.now());
      console.log('✅ Produtos carregados:', data.length);
      
    } catch (err) {
      console.error('❌ Erro ao carregar produtos:', err);
      const errorMessage = err.message || MESSAGES.PRODUCT.LOAD_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getToken, shouldFetch, toast]);

  // Carregar categorias para relacionamento
  const fetchCategories = useCallback(async () => {
    try {
      const token = getToken();
      const { categoryService } = await import('../services/api');
      const data = await categoryService.fetchCategories(token);
      setCategories(data.filter(cat => cat.ativo === true)); // Apenas ativas
    } catch (err) {
      console.error('❌ Erro ao carregar categorias:', err);
    }
  }, [getToken]);

  // Criar produto - CORRIGIDO
  const createProduct = useCallback(async (productData, imageFile) => {
    console.log('🆕 Criando produto:', productData.nome);

    try {
      // Validar dados
      if (!productData.nome?.trim()) {
        throw new Error(MESSAGES.PRODUCT.NAME_REQUIRED);
      }
      if (!productData.descricao?.trim()) {
        throw new Error(MESSAGES.PRODUCT.DESCRIPTION_REQUIRED);
      }
      // CORRIGIDO: Verificar categoria usando o campo correto
      if (!productData.categoria && !productData.categoriaId) {
        throw new Error(MESSAGES.PRODUCT.CATEGORY_REQUIRED);
      }
      if (!productData.preco || productData.preco <= 0) {
        throw new Error(MESSAGES.PRODUCT.PRICE_REQUIRED);
      }
      if (!imageFile) {
        throw new Error(MESSAGES.PRODUCT.IMAGE_REQUIRED);
      }

      // Validar imagem
      const { validateImageFile } = await import('../utils/helpers');
      const imageValidation = validateImageFile(imageFile);
      if (!imageValidation.valid) {
        throw new Error(imageValidation.error);
      }

      const token = getToken();
      await productService.createProduct(productData, imageFile, token);
      
      toast.success(MESSAGES.PRODUCT.CREATE_SUCCESS);
      
      // Recarregar lista
      await fetchProducts(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao criar produto:', err);
      const errorMessage = err.message || MESSAGES.PRODUCT.CREATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchProducts]);

  // Atualizar produto - CORRIGIDO
  const updateProduct = useCallback(async (productData, imageFile = null) => {
    console.log('✏️ Atualizando produto:', productData.nome);

    try {
      // Validar dados
      if (!productData.nome?.trim()) {
        throw new Error(MESSAGES.PRODUCT.NAME_REQUIRED);
      }
      if (!productData.descricao?.trim()) {
        throw new Error(MESSAGES.PRODUCT.DESCRIPTION_REQUIRED);
      }
      // CORRIGIDO: Verificar categoria usando o campo correto
      if (!productData.categoria && !productData.categoriaId) {
        throw new Error(MESSAGES.PRODUCT.CATEGORY_REQUIRED);
      }
      if (!productData.preco || productData.preco <= 0) {
        throw new Error(MESSAGES.PRODUCT.PRICE_REQUIRED);
      }

      // Validar imagem se fornecida
      if (imageFile) {
        const { validateImageFile } = await import('../utils/helpers');
        const imageValidation = validateImageFile(imageFile);
        if (!imageValidation.valid) {
          throw new Error(imageValidation.error);
        }
      }

      const token = getToken();
      await productService.updateProduct(productData, imageFile, token);
      
      toast.success(MESSAGES.PRODUCT.UPDATE_SUCCESS);
      
      // Recarregar lista
      await fetchProducts(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao atualizar produto:', err);
      const errorMessage = err.message || MESSAGES.PRODUCT.UPDATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchProducts]);

  // Excluir produto
  const deleteProduct = useCallback(async (productId) => {
    console.log('🗑️ Excluindo produto:', productId);

    try {
      const token = getToken();
      await productService.deleteProduct(productId, token);
      
      toast.success(MESSAGES.PRODUCT.DELETE_SUCCESS);
      
      // Recarregar lista
      await fetchProducts(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao excluir produto:', err);
      const errorMessage = err.message || MESSAGES.PRODUCT.DELETE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchProducts]);

  // Buscar produto por ID
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  // Buscar categoria por nome (já que produtos só têm o nome da categoria)
  const getCategoryByName = useCallback((categoryName) => {
    return categories.find(category => 
      (category.nome || category.name) === categoryName
    );
  }, [categories]);

  // Produtos filtrados - agora usando IDs de categoria
  const filteredProducts = products.filter(product => {
    const productName = product?.nome || product?.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = product?.ativo === true || product?.active === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = product?.ativo === false || product?.active === false;
    }
    
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      // Agora podemos usar o ID da categoria diretamente
      matchesCategory = product?.categoriaId === parseInt(categoryFilter) || product?.categoryId === parseInt(categoryFilter);
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Estatísticas atualizadas
  const stats = {
    total: products.length,
    active: products.filter(p => p?.ativo === true || p?.active === true).length,
    inactive: products.filter(p => p?.ativo === false || p?.active === false).length,
    totalValue: products.reduce((sum, p) => {
      const price = p?.preco || p?.price || 0;
      return sum + price;
    }, 0),
    totalDiscountValue: products.reduce((sum, p) => {
      const discountPrice = p?.precoDesconto || p?.discountPrice;
      const price = p?.preco || p?.price || 0;
      return sum + (discountPrice || price);
    }, 0),
    averagePrice: products.length > 0 ? products.reduce((sum, p) => {
      const price = p?.preco || p?.price || 0;
      return sum + price;
    }, 0) / products.length : 0,
    withDiscount: products.filter(p => {
      const discountPrice = p?.precoDesconto || p?.discountPrice;
      const price = p?.preco || p?.price || 0;
      return discountPrice && discountPrice < price;
    }).length,
    byCategory: categories.map(category => {
      const categoryProducts = products.filter(p => 
        p?.categoriaId === category.id || p?.categoryId === category.id
      );
      return {
        categoryId: category.id,
        categoryName: category.nome || category.name,
        count: categoryProducts.length,
        totalValue: categoryProducts.reduce((sum, p) => {
          const price = p?.preco || p?.price || 0;
          return sum + price;
        }, 0)
      };
    }).filter(item => item.count > 0)
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Só executa uma vez ao montar - intencionalmente sem dependências

  return {
    // Estados
    products,
    categories,
    filteredProducts,
    loading,
    error,
    stats,
    
    // Filtros
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    
    // Ações
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategoryByName,
    
    // Helpers
    clearError: () => setError(null),
    hasProducts: products.length > 0,
    hasFilteredProducts: filteredProducts.length > 0,
    
    // Estados calculados
    isLoading: loading,
    hasError: !!error,
    isEmpty: !loading && products.length === 0,
    isFiltered: searchTerm.length > 0 || statusFilter !== STATUS_FILTERS.ALL || categoryFilter !== 'all'
  };
};

// Hook simplificado para apenas listar produtos
export const useProductsList = () => {
  const { 
    products: allProducts, 
    filteredProducts, 
    categories,
    loading, 
    fetchProducts,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter
  } = useProducts();

  return {
    products: filteredProducts,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    refresh: fetchProducts
  };
};

// Hook para estatísticas de produtos
export const useProductStats = () => {
  const { products, stats, loading } = useProducts();
  
  return {
    stats,
    loading,
    hasData: products.length > 0
  };
};

// Hook para produtos recentes
export const useRecentProducts = (limit = 5) => {
  const { products, loading } = useProducts();
  
  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt || b.createAt || 0) - new Date(a.createdAt || a.createAt || 0))
    .slice(0, limit);
  
  const hasMore = products.length > limit;
  const totalCount = products.length;

  return {
    products: recentProducts,
    loading,
    hasMore,
    totalCount,
    isEmpty: !loading && products.length === 0
  };
};