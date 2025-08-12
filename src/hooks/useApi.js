// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

// Hook para produtos com suporte a subcategorias
export const useProdutos = (categoria = 'Todos', subcategoria = 'Todas', page = 0, size = 12) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (categoria === 'Todos' && subcategoria === 'Todas') {
          response = await apiService.getProdutos(page, size);
        } else if (categoria !== 'Todos' && subcategoria === 'Todas') {
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        } else if (subcategoria !== 'Todas') {
          response = await apiService.getProdutosPorSubcategoria(categoria, subcategoria, page, size);
        } else {
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        }

        const produtosTransformados = response.content
          .map(produto => apiService.transformProdutoData(produto))
          .filter(produto => produto !== null); // Remove produtos null/inválidos

        setProdutos(produtosTransformados);
        setPageInfo(response.page);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [categoria, subcategoria, page, size]);

  return { produtos, loading, error, pageInfo };
};

// Hook para categorias
export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getCategorias();
        const categoriasTransformadas = response.map(categoria =>
          apiService.transformCategoriaData(categoria)
        );

        // Adicionar categoria "Todos" no início
        const categoriasComTodos = [
          {
            id: 0,
            nome: 'Todos',
            slug: 'todos',
            descricao: 'Todos os produtos',
            imagem: null,
            totalProdutos: 0,
            ativo: true
          },
          ...categoriasTransformadas
        ];

        setCategorias(categoriasComTodos);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar categorias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};

// Hook para produto individual
export const useProduto = (id) => {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getProdutoPorId(id);
        const produtoTransformado = apiService.transformProdutoData(response);
        
        setProduto(produtoTransformado);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  return { produto, loading, error };
};

// Hook para produtos relacionados
export const useProdutosRelacionados = (id) => {
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutosRelacionados = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getProdutosRelacionados(id);
        const produtosTransformados = response.content.map(produto =>
          apiService.transformProdutoData(produto)
        );
        
        setProdutosRelacionados(produtosTransformados);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar produtos relacionados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutosRelacionados();
  }, [id]);

  return { produtosRelacionados, loading, error };
};

// Hook para subcategorias
export const useSubcategorias = (categoriaId = null) => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (categoriaId) {
          response = await apiService.getSubcategoriasPorCategoria(categoriaId);
        } else {
          response = await apiService.getSubcategorias();
        }

        // Transformar os dados das subcategorias
        const subcategoriasTransformadas = response.map(subcategoria => ({
          id: subcategoria.id,
          nome: subcategoria.nome || subcategoria.name,
          categoria: subcategoria.categoria?.nome || subcategoria.category?.nome,
          slug: subcategoria.slug,
          descricao: subcategoria.descricao || subcategoria.description,
          ativo: subcategoria.ativo !== undefined ? subcategoria.ativo : subcategoria.active
        }));
        
        setSubcategorias(subcategoriasTransformadas);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar subcategorias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategorias();
  }, [categoriaId]);

  return { subcategorias, loading, error };
};

// Hook genérico para refetch de dados
export const useRefetch = () => {
  const [isRefetching, setIsRefetching] = useState(false);

  const refetch = async (fetchFunction) => {
    try {
      setIsRefetching(true);
      await fetchFunction();
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      throw error;
    } finally {
      setIsRefetching(false);
    }
  };

  return { refetch, isRefetching };
};