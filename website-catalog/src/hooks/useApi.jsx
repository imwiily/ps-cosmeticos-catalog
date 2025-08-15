// src/hooks/useApi.jsx - VERSÃO CORRIGIDA
import { useState, useEffect } from 'react';
import apiService from '../services/api';

// ✅ CORRIGIDO: Hook para produtos com suporte a subcategorias
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
          // ✅ CORRIGIDO: Buscar todos os produtos com category='todos'
          response = await apiService.getProdutos(page, size, 'todos');
        } else if (categoria !== 'Todos' && subcategoria === 'Todas') {
          // ✅ CORRIGIDO: Buscar produtos por categoria
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        } else if (subcategoria !== 'Todas') {
          // ✅ CORRIGIDO: Buscar produtos por subcategoria
          response = await apiService.getProdutosPorSubcategoria(categoria, subcategoria, page, size);
        } else {
          response = await apiService.getProdutosPorCategoria(categoria, page, size);
        }

        console.log('📦 Resposta da API:', response);

        if (!response.content) {
          console.warn('⚠️ API retornou resposta sem content:', response);
          setProdutos([]);
          setPageInfo({});
          return;
        }

        // ✅ CORRIGIDO: Transformar produtos e filtrar inválidos
        const produtosTransformados = response.content
          .map(produto => {
            console.log('🔄 Transformando produto:', produto);
            return apiService.transformProdutoData(produto);
          })
          .filter(produto => {
            if (produto === null) {
              console.warn('⚠️ Produto nulo após transformação');
              return false;
            }
            return true;
          });

        console.log('✅ Produtos transformados:', produtosTransformados.length);
        
        setProdutos(produtosTransformados);
        setPageInfo(response.page || {});
        
      } catch (err) {
        console.error('❌ Erro ao carregar produtos:', err);
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

// ✅ CORRIGIDO: Hook para categorias
export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🗂️ Buscando categorias...');
        
        const response = await apiService.getCategorias();
        
        console.log('📋 Categorias da API:', response);
        
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

        console.log('✅ Categorias processadas:', categoriasComTodos.length);
        setCategorias(categoriasComTodos);
        
      } catch (err) {
        console.error('❌ Erro ao carregar categorias:', err);
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

// ✅ CORRIGIDO: Hook para produto individual
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
        
        console.log('🛍️ Buscando produto:', id);
        
        const response = await apiService.getProdutoPorId(id);
        
        console.log('📦 Produto da API:', response);
        
        if (response) {
          const produtoTransformado = apiService.transformProdutoData(response);
          console.log('✅ Produto transformado:', produtoTransformado);
          setProduto(produtoTransformado);
        } else {
          console.warn('⚠️ Produto não encontrado');
          setProduto(null);
        }
        
      } catch (err) {
        console.error('❌ Erro ao carregar produto:', err);
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

// ✅ CORRIGIDO: Hook para produtos relacionados
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
        
        console.log('🔗 Buscando produtos relacionados para:', id);
        
        // ✅ CORRIGIDO: Usar método atualizado
        const response = await apiService.getProdutosRelacionados(id, 'todos');
        
        console.log('📦 Produtos relacionados da API:', response);
        
        const produtosTransformados = response.content.map(produto => {
          return apiService.transformProdutoData(produto);
        }).filter(produto => produto !== null);
        
        console.log('✅ Produtos relacionados processados:', produtosTransformados.length);
        setProdutosRelacionados(produtosTransformados);
        
      } catch (err) {
        console.error('❌ Erro ao carregar produtos relacionados:', err);
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

// ✅ CORRIGIDO: Hook para subcategorias
export const useSubcategorias = (categoriaId = null) => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏷️ Buscando subcategorias...');
        
        let response;
        if (categoriaId) {
          response = await apiService.getSubcategoriasPorCategoria(categoriaId);
        } else {
          response = await apiService.getSubcategorias();
        }

        console.log('📋 Subcategorias da API:', response);

        // ✅ CORRIGIDO: Transformar os dados das subcategorias
        const subcategoriasTransformadas = response.map(subcategoria => {
          return apiService.transformSubcategoriaData(subcategoria);
        });
        
        console.log('✅ Subcategorias processadas:', subcategoriasTransformadas.length);
        setSubcategorias(subcategoriasTransformadas);
        
      } catch (err) {
        console.error('❌ Erro ao carregar subcategorias:', err);
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
      console.error('Erro ao recarregar dados:', error);
      throw error;
    } finally {
      setIsRefetching(false);
    }
  };

  return { refetch, isRefetching };
};