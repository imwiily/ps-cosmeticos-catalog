/**
 * Hook de Gerenciamento de Categorias
 * Lógica completa para CRUD de categorias
 */

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './useToast';
import { filterCategories, calculateCategoryStats, validateImageFile } from '../utils/helpers';
import { MESSAGES, STATUS_FILTERS } from '../utils/constants';

export const useCategories = () => {
  // Estados
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ALL);
  const [lastFetch, setLastFetch] = useState(null);

  // Hooks
  const { getToken } = useAuth();
  const toast = useToast();

  // Cache simples - só busca se não buscou nos últimos 30 segundos
  const shouldFetch = () => {
    if (!lastFetch) return true;
    const timeDiff = Date.now() - lastFetch;
    return timeDiff > 30000; // 30 segundos
  };

  // Carregar categorias
  const fetchCategories = useCallback(async (force = false) => {
    // Se não deve buscar e não é forçado, retorna
    if (!force && !shouldFetch()) {
      console.log('📋 Cache válido, não buscando categorias');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('📋 Carregando categorias...');
      const token = getToken();
      const data = await categoryService.fetchCategories(token);
      
      setCategories(data);
      setLastFetch(Date.now());
      console.log('✅ Categorias carregadas:', data.length);
      
    } catch (err) {
      console.error('❌ Erro ao carregar categorias:', err);
      const errorMessage = err.message || MESSAGES.CATEGORY.LOAD_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependências problemáticas

  // Criar categoria
  const createCategory = useCallback(async (categoryData, imageFile) => {
    console.log('🆕 Criando categoria:', categoryData.nome);

    try {
      // Validar dados
      if (!categoryData.nome?.trim()) {
        throw new Error(MESSAGES.CATEGORY.NAME_REQUIRED);
      }
      if (!categoryData.descricao?.trim()) {
        throw new Error(MESSAGES.CATEGORY.DESCRIPTION_REQUIRED);
      }
      if (!imageFile) {
        throw new Error(MESSAGES.CATEGORY.IMAGE_REQUIRED);
      }

      // Validar imagem
      const imageValidation = validateImageFile(imageFile);
      if (!imageValidation.valid) {
        throw new Error(imageValidation.error);
      }

      const token = getToken();
      await categoryService.createCategory(categoryData, imageFile, token);
      
      toast.success(MESSAGES.CATEGORY.CREATE_SUCCESS);
      
      // Recarregar lista
      await fetchCategories(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao criar categoria:', err);
      const errorMessage = err.message || MESSAGES.CATEGORY.CREATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchCategories]);

  // Atualizar categoria
  const updateCategory = useCallback(async (categoryData, imageFile = null) => {
    console.log('✏️ Atualizando categoria:', categoryData.nome);

    try {
      // Validar dados
      if (!categoryData.nome?.trim()) {
        throw new Error(MESSAGES.CATEGORY.NAME_REQUIRED);
      }
      if (!categoryData.descricao?.trim()) {
        throw new Error(MESSAGES.CATEGORY.DESCRIPTION_REQUIRED);
      }

      // Validar imagem se fornecida
      if (imageFile) {
        const imageValidation = validateImageFile(imageFile);
        if (!imageValidation.valid) {
          throw new Error(imageValidation.error);
        }
      }

      const token = getToken();
      await categoryService.updateCategory(categoryData, imageFile, token);
      
      toast.success(MESSAGES.CATEGORY.UPDATE_SUCCESS);
      
      // Recarregar lista
      await fetchCategories(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao atualizar categoria:', err);
      const errorMessage = err.message || MESSAGES.CATEGORY.UPDATE_ERROR;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchCategories]);

  // Excluir categoria
  const deleteCategory = useCallback(async (categoryId) => {
    console.log('🗑️ Excluindo categoria:', categoryId);

    try {
      const token = getToken();
      await categoryService.deleteCategory(categoryId, token);
      
      toast.success(MESSAGES.CATEGORY.DELETE_SUCCESS);
      
      // Recarregar lista
      await fetchCategories(true); // Força busca
      
      return { success: true };

    } catch (err) {
      console.error('❌ Erro ao excluir categoria:', err);
      
      let errorMessage = MESSAGES.CATEGORY.DELETE_ERROR;
      
      // Verificar se é erro de categoria com produtos
      if (err.code === 'C.ITDx0001') {
        errorMessage = MESSAGES.CATEGORY.DELETE_WITH_PRODUCTS;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getToken, toast, fetchCategories]);

  // Categorias filtradas
  const filteredCategories = filterCategories(categories, searchTerm, statusFilter);

  // Estatísticas
  const stats = calculateCategoryStats(categories);

  // Buscar categoria por ID
  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Carregar categorias ao montar o componente
  useEffect(() => {
    let isMounted = true; // Flag para evitar atualizações em componente desmontado
    
    const loadCategories = async () => {
      if (isMounted) {
        await fetchCategories();
      }
    };
    
    loadCategories();
    
    // Cleanup: marcar como desmontado
    return () => {
      isMounted = false;
    };
  }, []); // Array vazio - só executa uma vez

  return {
    // Estados
    categories,
    filteredCategories,
    loading,
    error,
    stats,
    
    // Filtros
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    
    // Ações
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    
    // Helpers
    clearError: () => setError(null),
    hasCategories: categories.length > 0,
    hasFilteredCategories: filteredCategories.length > 0,
    
    // Estados calculados
    isLoading: loading,
    hasError: !!error,
    isEmpty: !loading && categories.length === 0,
    isFiltered: searchTerm.length > 0 || statusFilter !== STATUS_FILTERS.ALL
  };
};

// Hook simplificado para apenas listar categorias
export const useCategoriesList = () => {
  const { 
    categories, 
    filteredCategories, 
    loading, 
    fetchCategories,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
  } = useCategories();

  return {
    categories: filteredCategories,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    refresh: fetchCategories
  };
};

// Hook para estatísticas de categorias
export const useCategoryStats = () => {
  const { categories, stats, loading } = useCategories();
  
  return {
    stats,
    loading,
    hasData: categories.length > 0
  };
};