// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  // Método auxiliar para fazer requests
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      // Retornar dados vazios em caso de erro para evitar quebras
      return {
        content: [],
        data: { content: [], page: {} },
        page: {}
      };
    }
  }

  // Pegar todas as categorias
  async getCategorias() {
    const response = await this.makeRequest('/categorias');
    return response.content || [];
  }

  // Pegar todas as subcategorias
  async getSubcategorias() {
    const response = await this.makeRequest('/subcategorias');
    return response.content || [];
  }

  // Pegar subcategorias por categoria
  async getSubcategoriasPorCategoria(categoriaId) {
    const response = await this.makeRequest(`/categorias/subcategorias/${categoriaId}`);
    return response.data || [];
  }

  // Pegar todos os produtos
  async getProdutos(page = 0, size = 12) {
    const response = await this.makeRequest(`/produtos?page=${page}&size=${size}`);
    return response.data || { content: [], page: {} };
  }

  // Pegar produto por ID
  async getProdutoPorId(id) {
    const response = await this.makeRequest(`/produtos/${id}`);
    return response.data;
  }

  // Pegar produtos relacionados
  async getProdutosRelacionados(id) {
    const response = await this.makeRequest(`/produtos/relacionados/${id}`);
    return response.data || { content: [], page: {} };
  }

  // Pegar URL da imagem com tipo específico
  getImageUrl(imageUrl, type = 'DISPLAY') {
    if (!imageUrl) return null;
    return `${imageUrl}?type=${type}`;
  }

  // Transformar dados da API para o formato esperado pelo frontend
  transformProdutoData(apiProduct) {
    // Verificações de segurança para evitar erros
    if (!apiProduct) {
      return null;
    }
  
    const price = apiProduct.price || 0;
    const discountPrice = apiProduct.discountPrice || null;
  
    return {
      id: apiProduct.id || Math.random().toString(36).substr(2, 9),
      nome: apiProduct.name || 'Produto sem nome',
      categoria: apiProduct.category?.nome || apiProduct.category?.name || 'Sem categoria',
      subcategoria: apiProduct.subcategory?.nome || apiProduct.subcategory?.name || 'Sem subcategoria',
      preco: `R$ ${price.toFixed(2).replace('.', ',')}`,
      precoDesconto: discountPrice 
        ? `R$ ${discountPrice.toFixed(2).replace('.', ',')}` 
        : null,
      imagem: this.getImageUrl(apiProduct.imageURL, 'DISPLAY'), // Para página de detalhes
      imagemIcone: this.getImageUrl(apiProduct.imageURL, 'ICON'), // Para miniaturas (não usar em cards)
      imagemMedia: this.getImageUrl(apiProduct.imageURL, 'MID-DISPLAY'), // ✅ Para cards (escala 0.5)
      descricao: apiProduct.description || 'Sem descrição disponível',
      descricaoCompleta: apiProduct.completeDescription || '',
      ingredientes: apiProduct.ingredients || [],
      modoUso: apiProduct.howToUse || '',
      tags: apiProduct.tags || [],
      slug: apiProduct.slug || '',
      tipo: apiProduct.tipo || 'SIMPLE',
      cores: apiProduct.cores || {},
      ativo: apiProduct.active !== undefined ? apiProduct.active : true,
      criadoEm: apiProduct.createAt || new Date().toISOString(),
      // Campos simulados que não existem na API
      rating: 4.5 + (Math.random() * 0.8), // Rating aleatório entre 4.5-5.3
      avaliacoes: Math.floor(Math.random() * 200) + 50, // Avaliações aleatórias entre 50-249
    };
  }

  // Transformar dados de categoria da API
  transformCategoriaData(apiCategory) {
    return {
      id: apiCategory.id,
      nome: apiCategory.nome,
      slug: apiCategory.slug,
      descricao: apiCategory.descricao || '',
      imagem: this.getImageUrl(apiCategory.imageUrl, 'DISPLAY'),
      totalProdutos: apiCategory.totalProdutos || 0,
      ativo: apiCategory.ativo,
    };
  }

  // Buscar produtos por categoria
  async getProdutosPorCategoria(categoria, page = 0, size = 12) {
    // Como não há endpoint específico para filtrar por categoria,
    // vamos pegar todos os produtos e filtrar no frontend
    const response = await this.getProdutos(page, size * 3); // Pegar mais para compensar filtro
    const produtosTransformados = response.content.map(produto => 
      this.transformProdutoData(produto)
    );

    if (categoria === 'Todos') {
      return {
        content: produtosTransformados.slice(0, size),
        page: response.page
      };
    }

    const produtosFiltrados = produtosTransformados.filter(produto => 
      produto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    return {
      content: produtosFiltrados.slice(0, size),
      page: {
        ...response.page,
        totalElements: produtosFiltrados.length,
        totalPages: Math.ceil(produtosFiltrados.length / size)
      }
    };
  }

  // Buscar produtos por subcategoria
  async getProdutosPorSubcategoria(categoria, subcategoria, page = 0, size = 12) {
    // Pegar todos os produtos e filtrar por categoria e subcategoria
    const response = await this.getProdutos(page, size * 4); // Pegar mais para compensar filtro duplo
    const produtosTransformados = response.content.map(produto => 
      this.transformProdutoData(produto)
    );

    let produtosFiltrados = produtosTransformados;

    // Filtrar por categoria (se não for "Todos")
    if (categoria !== 'Todos') {
      produtosFiltrados = produtosFiltrados.filter(produto => 
        produto.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    // Filtrar por subcategoria (se não for "Todas")
    if (subcategoria !== 'Todas') {
      produtosFiltrados = produtosFiltrados.filter(produto => 
        produto.subcategoria.toLowerCase() === subcategoria.toLowerCase()
      );
    }

    return {
      content: produtosFiltrados.slice(0, size),
      page: {
        ...response.page,
        totalElements: produtosFiltrados.length,
        totalPages: Math.ceil(produtosFiltrados.length / size)
      }
    };
  }
}

// Criar instância singleton
const apiService = new ApiService();

export default apiService;