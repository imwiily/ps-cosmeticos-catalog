// src/services/api.js - VERSÃO COM DEBUG DE IMAGENS
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
        success: false,
        data: { content: [], page: {} },
        errorCode: 'NETWORK_ERROR'
      };
    }
  }

  // ✅ CORREÇÃO: Método getImageUrl melhorado com debug
  getImageUrl(imageUrl, type = 'DISPLAY') {
    console.log('🔗 getImageUrl chamado:', { imageUrl, type });
    
    if (!imageUrl) {
      console.warn('⚠️ imageUrl está vazio');
      return null;
    }
    
    // Se imageUrl já é uma URL completa com protocolo
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const finalUrl = `${imageUrl}?type=${type}`;
      console.log('✅ URL completa gerada:', finalUrl);
      return finalUrl;
    }
    
    // Se é apenas o nome do arquivo ou caminho relativo
    const finalUrl = `${API_BASE_URL}/image/${imageUrl}?type=${type}`;
    console.log('✅ URL do endpoint gerada:', finalUrl);
    return finalUrl;
  }

  // ✅ CORRIGIDO: Pegar todos os produtos COM parâmetro category
  async getProdutos(page = 0, size = 12, category = 'todos') {
    const response = await this.makeRequest(`/produtos?page=${page}&size=${size}&category=${category}`);
    
    // ✅ CORRIGIDO: A API retorna { success: boolean, data: {...} }
    if (response.success && response.data) {
      return response.data;
    }
    
    return { content: [], page: {} };
  }

  // ✅ CORRIGIDO: Produto por ID 
  async getProdutoPorId(id) {
    const response = await this.makeRequest(`/produtos/${id}`);
    
    // ✅ CORRIGIDO: A API retorna { success: boolean, data: {...} }
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  // Pegar todas as categorias
  async getCategorias() {
    const response = await this.makeRequest('/categorias?page=0&size=50');
    
    // ✅ CORRIGIDO: Categorias retornam PagedModel diretamente
    if (response.content) {
      return response.content;
    }
    
    return [];
  }

  // Pegar todas as subcategorias
  async getSubcategorias() {
    const response = await this.makeRequest('/subcategorias?page=0&size=100');
    
    // ✅ CORRIGIDO: Subcategorias retornam PagedModel diretamente
    if (response.content) {
      return response.content;
    }
    
    return [];
  }

  // Pegar subcategorias por categoria
  async getSubcategoriasPorCategoria(categoriaId) {
    const response = await this.makeRequest(`/categorias/subcategorias/${categoriaId}`);
    
    // Este endpoint retorna object diretamente
    return Array.isArray(response) ? response : [];
  }

  // ✅ CORREÇÃO: transformProdutoData com debug completo de imagens
  transformProdutoData(apiProduct) {
    // Verificações de segurança para evitar erros
    if (!apiProduct) {
      console.warn('Produto vazio recebido da API');
      return null;
    }

    console.log('🔍 DEBUG produto da API:', apiProduct);

    // ✅ Mapear campos da API corretamente
    let price = apiProduct.price || apiProduct.preco || 0;
    let discountPrice = apiProduct.discountPrice || apiProduct.precoDesconto || null;
    const name = apiProduct.name || apiProduct.nome || 'Produto sem nome';
    const description = apiProduct.description || apiProduct.descricao || 'Sem descrição disponível';

    console.log('🔍 Debug preços antes da conversão:', { 
      price, 
      discountPrice, 
      priceType: typeof price, 
      discountPriceType: typeof discountPrice 
    });

    // ✅ CORREÇÃO: Converter preços para números de forma mais robusta
    try {
      // Tratar price
      if (price !== null && price !== undefined) {
        if (typeof price === 'string') {
          // Remove R$, espaços e vírgulas, substitui vírgula por ponto
          const cleanPrice = price.replace(/[R$\s]/g, '').replace(',', '.');
          price = parseFloat(cleanPrice);
          console.log('🔄 Price convertido de string:', cleanPrice, '->', price);
        }
        
        // Garantir que é um número válido
        if (isNaN(price) || !isFinite(price)) {
          console.warn('⚠️ Price inválido, usando 0:', price);
          price = 0;
        }
      } else {
        price = 0;
      }

      // Tratar discountPrice
      if (discountPrice !== null && discountPrice !== undefined) {
        if (typeof discountPrice === 'string') {
          const cleanDiscountPrice = discountPrice.replace(/[R$\s]/g, '').replace(',', '.');
          discountPrice = parseFloat(cleanDiscountPrice);
          console.log('🔄 DiscountPrice convertido de string:', cleanDiscountPrice, '->', discountPrice);
        }
        
        // Garantir que é um número válido
        if (isNaN(discountPrice) || !isFinite(discountPrice)) {
          console.warn('⚠️ DiscountPrice inválido, usando null:', discountPrice);
          discountPrice = null;
        }
      }

      console.log('✅ Preços após conversão:', { price, discountPrice });

    } catch (error) {
      console.error('❌ Erro ao converter preços:', error);
      price = 0;
      discountPrice = null;
    }

    // ✅ PROCESSAR IMAGENS COM DEBUG DETALHADO
    console.log('🖼️ Campos de imagem disponíveis na API:');
    console.log('📷 imageURL:', apiProduct.imageURL);
    console.log('📷 imageUrl:', apiProduct.imageUrl);
    console.log('📷 image_url:', apiProduct.image_url);
    console.log('📷 imagem:', apiProduct.imagem);

    const imageURL = apiProduct.imageURL || 
                     apiProduct.imageUrl || 
                     apiProduct.image_url || 
                     apiProduct.imagem || 
                     null;
    
    console.log('🔗 imageURL final escolhida:', imageURL);

    // ✅ Criar o objeto produto transformado
    const produtoTransformado = {
      id: apiProduct.id || Math.random().toString(36).substr(2, 9),
      nome: name,
      categoria: apiProduct.category?.nome || apiProduct.category?.name || apiProduct.categoria || 'Sem categoria',
      subcategoria: apiProduct.subcategory?.nome || apiProduct.subcategory?.name || apiProduct.subcategoria || 'Sem subcategoria',
      preco: `R$ ${price.toFixed(2).replace('.', ',')}`,
      precoDesconto: discountPrice 
        ? `R$ ${discountPrice.toFixed(2).replace('.', ',')}` 
        : null,
      
      // ✅ IMAGENS COM DEBUG
      imagem: this.getImageUrl(imageURL, 'DISPLAY'),
      imagemIcone: this.getImageUrl(imageURL, 'ICON'),
      imagemMedia: this.getImageUrl(imageURL, 'MID-DISPLAY'),
      imageURL: imageURL, // Manter original para debug
      
      descricao: description,
      descricaoCompleta: apiProduct.completeDescription || apiProduct.descricaoCompleta || description,
      ingredientes: apiProduct.ingredients || apiProduct.ingredientes || [],
      modoUso: apiProduct.howToUse || apiProduct.modoUso || '',
      tags: apiProduct.tags || [],
      slug: apiProduct.slug || '',
      tipo: apiProduct.tipo || apiProduct.type || 'SIMPLE',
      cores: apiProduct.cores || apiProduct.colors || {},
      ativo: apiProduct.active !== undefined ? apiProduct.active : (apiProduct.ativo !== undefined ? apiProduct.ativo : true),
      criadoEm: apiProduct.createAt || apiProduct.criadoEm || new Date().toISOString(),
      // Campos simulados que não existem na API
      rating: 4.5 + (Math.random() * 0.8),
      avaliacoes: Math.floor(Math.random() * 200) + 50,
    };

    console.log('✅ URLs de imagem geradas:');
    console.log('📷 imagem (DISPLAY):', produtoTransformado.imagem);
    console.log('📷 imagemMedia (MID-DISPLAY):', produtoTransformado.imagemMedia);
    console.log('📷 imagemIcone (ICON):', produtoTransformado.imagemIcone);

    console.log('✅ Produto transformado final:', produtoTransformado);
    return produtoTransformado;
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

  // Transformar dados de subcategoria da API
  transformSubcategoriaData(apiSubcategory) {
    return {
      id: apiSubcategory.id,
      nome: apiSubcategory.name, // ✅ API usa 'name', não 'nome'
      categoria: {
        id: apiSubcategory.category_info?.id,
        nome: apiSubcategory.category_info?.name // ✅ API usa 'name', não 'nome'
      },
      slug: apiSubcategory.slug || '',
      descricao: apiSubcategory.description || '',
      ativo: apiSubcategory.active !== undefined ? apiSubcategory.active : true
    };
  }

  // Buscar produtos por categoria usando parâmetro category
  async getProdutosPorCategoria(categoria, page = 0, size = 12) {
    try {
      let categoryParam = categoria;
      
      // Mapear categorias do frontend para valores da API
      if (categoria === 'Todos') {
        categoryParam = 'todos';
      } else {
        categoryParam = categoria.toLowerCase();
      }

      const response = await this.getProdutos(page, size, categoryParam);
      
      const produtosTransformados = response.content
        .map(produto => this.transformProdutoData(produto))
        .filter(produto => produto !== null);

      return {
        content: produtosTransformados,
        page: response.page
      };
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return { content: [], page: {} };
    }
  }

  // Buscar produtos por subcategoria 
  async getProdutosPorSubcategoria(categoria, subcategoria, page = 0, size = 12) {
    try {
      // Primeiro buscar todos os produtos da categoria
      const response = await this.getProdutosPorCategoria(categoria, page, size * 2);
      
      // Filtrar por subcategoria no frontend (já que a API não tem esse filtro específico)
      let produtosFiltrados = response.content;
      
      if (subcategoria !== 'Todas') {
        produtosFiltrados = response.content.filter(produto => 
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
    } catch (error) {
      console.error('Erro ao buscar produtos por subcategoria:', error);
      return { content: [], page: {} };
    }
  }

  // Produtos relacionados
  async getProdutosRelacionados(id, category = 'todos') {
    const response = await this.makeRequest(`/produtos?page=0&size=8&category=${category}`);
    
    if (response.success && response.data) {
      // Filtrar produtos relacionados (excluir o produto atual)
      const produtosFiltrados = response.data.content.filter(produto => produto.id !== id);
      return {
        content: produtosFiltrados.slice(0, 4), // Apenas 4 relacionados
        page: response.data.page
      };
    }
    
    return { content: [], page: {} };
  }
}

// Criar instância singleton
const apiService = new ApiService();

export default apiService;