// src/hooks/useApi.jsx - VERSÃO LIMPA SEM DEBUGS
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
          // Buscar todos os produtos com category='todos'
          response = await apiService.getProdutos(page, size, 'todos');
        } else if (categoria !== 'Todos' && subcategoria === 'Todas') {
          // Buscar produtos por categoria
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        } else if (subcategoria !== 'Todas') {
          // Buscar produtos por subcategoria
          response = await apiService.getProdutosPorSubcategoria(categoria, subcategoria, page, size);
        } else {
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        }

        if (!response.content) {
          setProdutos([]);
          setPageInfo({});
          return;
        }

        // Transformar produtos e filtrar inválidos
        const produtosTransformados = response.content
          .map(produto => {
            return apiService.transformProdutoData(produto);
          })
          .filter(produto => {
            if (produto === null) {
              return false;
            }
            return true;
          });
        
        setProdutos(produtosTransformados);
        setPageInfo(response.page || {});
        
      } catch (err) {
        setError(err.message);
        setProdutos([]);
        setPageInfo({});
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
        
        const categoriasTransformadas = response.map(categoria => {
          return apiService.transformCategoriaData(categoria);
        });

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
        setCategorias([]);
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
        
        if (response) {
          const produtoTransformado = apiService.transformProdutoData(response);
          setProduto(produtoTransformado);
        } else {
          setProduto(null);
        }
        
      } catch (err) {
        setError(err.message);
        setProduto(null);
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
        
        // Usar método atualizado
        const response = await apiService.getProdutosRelacionados(id, 'todos');
        
        const produtosTransformados = response.content.map(produto => {
          return apiService.transformProdutoData(produto);
        }).filter(produto => produto !== null);
        
        setProdutosRelacionados(produtosTransformados);
        
      } catch (err) {
        setError(err.message);
        setProdutosRelacionados([]);
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
        const subcategoriasTransformadas = response.map(subcategoria => {
          return apiService.transformSubcategoriaData(subcategoria);
        });
        
        setSubcategorias(subcategoriasTransformadas);
        
      } catch (err) {
        setError(err.message);
        setSubcategorias([]);
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
      throw error;
    } finally {
      setIsRefetching(false);
    }
  };

  return { refetch, isRefetching };
};