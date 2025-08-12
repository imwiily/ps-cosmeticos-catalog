/**
 * Serviços de API - VERSÃO CORRIGIDA
 * Funções centralizadas para comunicação com a API
 * 
 * INCLUI: Categorias, Produtos, Subcategorias e Multi-Color
 */

import { config, buildApiUrl } from '../utils/config';
import { API_ERROR_CODES } from '../utils/constants';

/**
 * Classe para erros customizados da API
 */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Função auxiliar para fazer requisições HTTP
 */
export const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      timeout: config.api.timeout,
      ...options,
    });

    // Se a resposta não for ok, tentar extrair erro
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}`;
      let errorCode = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.errorCode || null;
      } catch (parseError) {
        // Se não conseguir parsear JSON, usar mensagem padrão
        errorMessage = await response.text() || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erro de rede ou timeout
    throw new ApiError('Erro de conexão com o servidor', 0, 'NETWORK_ERROR');
  }
};

/**
 * Serviços de Autenticação
 */
export const authService = {
  /**
   * Fazer login
   */
  async login(credentials) {
    console.log('🔐 Fazendo login...', credentials.username);

    const response = await makeRequest(buildApiUrl(config.endpoints.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!data.accessToken) {
      throw new ApiError('Token não recebido do servidor', 200, 'NO_TOKEN');
    }

    console.log('✅ Login realizado com sucesso');
    return data;
  }
};

/**
 * Serviços de Categorias
 */
export const categoryService = {
  /**
   * Buscar todas as categorias
   */
  async fetchCategories(token) {
    console.log('📋 Buscando categorias...');

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.list), {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const data = await response.json();
    
    // Normalizar resposta da API
    let categories = [];
    if (data.success && data.data && data.data.content && Array.isArray(data.data.content)) {
      categories = data.data.content;
    } else if (data.content && Array.isArray(data.content)) {
      categories = data.content;
    } else if (Array.isArray(data)) {
      categories = data;
    }

    console.log('✅ Categorias carregadas:', categories.length);
    return categories;
  },

  /**
   * Criar nova categoria
   */
  async createCategory(categoryData, imageFile, token) {
    console.log('🆕 Criando nova categoria...', categoryData.nome);

    const formData = new FormData();
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(categoryData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    formData.append('imagem', imageFile);
    
    console.log('📦 FormData preparado - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.create), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    console.log('✅ Categoria criada com sucesso!');
    return result;
  },

  /**
   * Atualizar categoria existente
   */
  async updateCategory(categoryData, imageFile, token) {
    console.log('✏️ Atualizando categoria...', categoryData.nome);

    const formData = new FormData();
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(categoryData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    
    // Adicionar imagem se fornecida
    if (imageFile) {
      formData.append('imagem', imageFile);
      console.log('🖼️ Nova imagem incluída');
    }

    console.log('📦 FormData preparado para PUT - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.categories.update), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('✅ Categoria atualizada com sucesso!');
    return response.ok ? { success: true } : await response.json();
  },

  /**
   * Excluir categoria
   */
  async deleteCategory(categoryId, token) {
    console.log('🗑️ Excluindo categoria...', categoryId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.categories.delete}/${categoryId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Categoria excluída com sucesso!');
    return response.ok;
  }
};

/**
 * Serviços de Subcategorias - NOVO
 */
export const subcategoryService = {
  /**
   * Buscar todas as subcategorias
   */
  async fetchAllSubcategories(token) {
    console.log('📋 Buscando todas as subcategorias...');

    const response = await makeRequest(buildApiUrl(config.endpoints.subcategories.list), {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const data = await response.json();
    
    // Normalizar resposta da API
    let subcategories = [];
    if (data.success && data.data && Array.isArray(data.data)) {
      subcategories = data.data;
    } else if (Array.isArray(data)) {
      subcategories = data;
    }

    console.log('✅ Subcategorias carregadas:', subcategories.length);
    return subcategories;
  },

  /**
   * Buscar subcategorias de uma categoria específica
   */
  async fetchSubcategoriesByCategory(categoryId, token) {
    console.log('📋 Buscando subcategorias da categoria:', categoryId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.subcategories.byCategory}/${categoryId}`),
      {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );

    const data = await response.json();
    
    // Normalizar resposta da API
    let subcategories = [];
    if (data.success && data.data && Array.isArray(data.data)) {
      subcategories = data.data;
    } else if (Array.isArray(data)) {
      subcategories = data;
    }

    console.log('✅ Subcategorias da categoria carregadas:', subcategories.length);
    return subcategories;
  },

  /**
   * Criar nova subcategoria
   */
  async createSubcategory(subcategoryData, token) {
    console.log('🆕 Criando nova subcategoria...', subcategoryData.name);

    const response = await makeRequest(buildApiUrl(config.endpoints.subcategories.create), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subcategoryData)
    });

    const result = await response.json();
    console.log('✅ Subcategoria criada com sucesso!');
    return result;
  },

  /**
   * Atualizar subcategoria existente
   */
  async updateSubcategory(subcategoryData, token) {
    console.log('✏️ Atualizando subcategoria...', subcategoryData.name);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.subcategories.update}/${subcategoryData.id}`),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subcategoryData)
      }
    );

    console.log('✅ Subcategoria atualizada com sucesso!');
    return response.ok ? { success: true } : await response.json();
  },

  /**
   * Excluir subcategoria
   */
  async deleteSubcategory(subcategoryId, token) {
    console.log('🗑️ Excluindo subcategoria...', subcategoryId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.subcategories.delete}/${subcategoryId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Subcategoria excluída com sucesso!');
    return response.ok;
  }
};

/**
 * Serviços de Produtos - ATUALIZADO COM MULTI-COLOR E SUBCATEGORIAS
 */
export const productService = {
  /**
   * Buscar todos os produtos
   */
  async fetchProducts(token) {
    console.log('📦 Buscando produtos...');

    const response = await makeRequest(buildApiUrl(config.endpoints.products.list), {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    const data = await response.json();
    
    // Normalizar resposta da API baseada na estrutura real
    let products = [];
    if (data.success && data.data && data.data.content && Array.isArray(data.data.content)) {
            /**
       * CORREÇÃO: Mapeamento de Subcategorias no fetchProducts
       * Arquivo: src/services/api.js (linha ~200-250)
       * 
       * PROBLEMA: API retorna "subcategory" mas código mapeia incorretamente
       * SOLUÇÃO: Mapear corretamente o campo subcategory da API
       */

      // ENCONTRE esta seção no seu arquivo src/services/api.js:

      products = data.data.content.map(product => ({
        id: product.id,
        nome: product.name,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageURL,
        imageURL: product.imageURL,
        
        // Categoria
        categoriaId: product.category?.id || null,
        categoryId: product.category?.id || null,
        categoria: product.category?.nome || product.category?.name || 'Sem categoria',
        category: product.category?.nome || product.category?.name || 'Sem categoria',
        categoriaNome: product.category?.nome || product.category?.name || 'Sem categoria',
        categoryName: product.category?.nome || product.category?.name || 'Sem categoria',
        categoryObject: product.category,
        
        // 🚨 CORREÇÃO: Subcategoria - ERA ASSIM (INCORRETO):
        // subcategoriaId: product.subCategory?.id || product.sub_categoria || null,
        // subCategoryId: product.subCategory?.id || product.sub_categoria || null,
        // subcategoria: product.subCategory?.name || null,
        // subCategory: product.subCategory?.name || null,
        // subcategoriaNome: product.subCategory?.name || null,
        // subCategoryName: product.subCategory?.name || null,
        
        // 🔧 CORREÇÃO: Subcategoria - DEVE SER ASSIM (CORRETO):
        subcategoriaId: product.subcategory?.id || null,                    // CORRIGIDO: subcategory (não subCategory)
        subCategoryId: product.subcategory?.id || null,                     // CORRIGIDO: subcategory (não subCategory)  
        subcategoria: product.subcategory?.nome || product.subcategory?.name || null,  // CORRIGIDO: subcategory
        subCategory: product.subcategory?.nome || product.subcategory?.name || null,   // CORRIGIDO: subcategory
        subcategoriaNome: product.subcategory?.nome || product.subcategory?.name || null, // CORRIGIDO: subcategory
        subCategoryName: product.subcategory?.nome || product.subcategory?.name || null,  // CORRIGIDO: subcategory
        subcategoryObject: product.subcategory,                             // NOVO: Objeto completo da subcategoria
        
        // NOVO: Tipo e cores
        tipo: product.type || product.tipo || 'STATIC',
        type: product.type || product.tipo || 'STATIC',
        cores: product.colors || product.cores || {},
        colors: product.colors || product.cores || {},
        
        // Preços
        preco: product.price,
        price: product.price,
        precoDesconto: product.discountPrice > 0 ? product.discountPrice : null,
        discountPrice: product.discountPrice > 0 ? product.discountPrice : null,
        
        // Descrições
        descricao: product.description,
        description: product.description,
        descricaoCompleta: product.completeDescription,
        completeDescription: product.completeDescription,
        
        // Arrays
        ingredientes: product.ingredients || [],
        ingredients: product.ingredients || [],
        tags: product.tags || [],
        
        // Modo de uso
        modoUso: product.howToUse,
        howToUse: product.howToUse,
        
        // Status
        ativo: product.active,
        active: product.active,
        
        // Datas
        createdAt: product.createAt,
        createAt: product.createAt,
        updatedAt: product.updateAt,
        updateAt: product.updateAt
      }));
    } else if (data.content && Array.isArray(data.content)) {
      products = data.content;
    } else if (Array.isArray(data)) {
      products = data;
    }

    console.log('✅ Produtos carregados:', products.length);
    return products;
  },

  /**
   * Buscar produto por ID
   */
  async getProductById(productId, token) {
    console.log('👁️ Buscando produto por ID:', productId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.products.getById}/${productId}`),
      {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );

    const data = await response.json();
    
    // Normalizar resposta para produto único (incluir novos campos)
    if (data.success && data.data) {
      const product = data.data;
      const normalized = {
        id: product.id,
        nome: product.name,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageURL,
        imageURL: product.imageURL,
        categoria: product.category,
        category: product.category,
        
        // 🔧 CORRIGI ESTA LINHA TAMBÉM:
        subcategoria: product.subcategory,    // CORRIGIDO: era subCategory, agora subcategory
        subCategory: product.subcategory,     // CORRIGIDO: era subCategory, agora subcategory
        subcategoriaId: product.subcategory?.id || null,  // NOVO: ID da subcategoria
        subCategoryId: product.subcategory?.id || null,   // NOVO: ID da subcategoria
        
        tipo: product.type || 'STATIC',
        type: product.type || 'STATIC',
        cores: product.colors || {},
        colors: product.colors || {},
        preco: product.price,
        price: product.price,
        precoDesconto: product.discountPrice,
        discountPrice: product.discountPrice,
        descricao: product.description,
        description: product.description,
        descricaoCompleta: product.completeDescription,
        completeDescription: product.completeDescription,
        ingredientes: product.ingredients || [],
        ingredients: product.ingredients || [],
        modoUso: product.howToUse,
        howToUse: product.howToUse,
        tags: product.tags || [],
        ativo: product.active,
        active: product.active,
        createdAt: product.createAt,
        createAt: product.createAt,
        updatedAt: product.updateAt,
        updateAt: product.updateAt
      };
      
      console.log('✅ Produto encontrado:', normalized.nome);
      return normalized;
    }
    
    return data;
  },

  /**
   * Criar novo produto - ATUALIZADO COM MULTI-COLOR E SUBCATEGORIAS
   */
  async createProduct(productData, imageFile, token) {
    console.log('🆕 Criando novo produto...', productData.nome);

    const formData = new FormData();
    
    // Mapear campos para o formato esperado pela API
    const apiData = {
      nome: productData.nome,
      preco: productData.preco,
      precoDesconto: productData.precoDesconto || null,
      descricao: productData.descricao,
      descricaoCompleta: productData.descricaoCompleta || productData.descricao,
      ingredientes: productData.ingredientes || [],
      tags: productData.tags || [],
      modoUso: productData.modoUso || '',
      ativo: productData.ativo !== false,
      categoria: productData.categoria, // API field
      sub_categoria: productData.sub_categoria || null, // NOVO: API field
      tipo: productData.tipo || 'STATIC', // NOVO: API field
      cores: productData.cores || {} // NOVO: API field
    };
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(apiData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    formData.append('imagem', imageFile);
    
    console.log('📦 FormData preparado - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(config.endpoints.products.create), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    console.log('✅ Produto criado com sucesso!');
    return result;
  },

  /**
   * Atualizar produto existente - ATUALIZADO COM MULTI-COLOR E SUBCATEGORIAS
   */
  async updateProduct(productData, imageFile, token) {
    console.log('✏️ Atualizando produto...', productData.nome);

    const formData = new FormData();
    
    // Mapear campos para o formato esperado pela API
    const apiData = {
      nome: productData.nome,
      preco: productData.preco,
      precoDesconto: productData.precoDesconto || null,
      descricao: productData.descricao,
      descricaoCompleta: productData.descricaoCompleta || productData.descricao,
      ingredientes: productData.ingredientes || [],
      tags: productData.tags || [],
      modoUso: productData.modoUso || '',
      ativo: productData.ativo !== false,
      categoria: productData.categoria, // API field
      sub_categoria: productData.sub_categoria || null, // NOVO: API field
      tipo: productData.tipo || 'STATIC', // NOVO: API field
      cores: productData.cores || {} // NOVO: API field
    };
    
    // Campo "dados" como Blob com Content-Type application/json
    const dadosJson = JSON.stringify(apiData);
    const dadosBlob = new Blob([dadosJson], { type: 'application/json' });
    formData.append('dados', dadosBlob);
    
    // Adicionar imagem se fornecida
    if (imageFile) {
      formData.append('imagem', imageFile);
      console.log('🖼️ Nova imagem incluída');
    }

    console.log('📦 FormData preparado para PUT - dados:', dadosJson);

    const response = await makeRequest(buildApiUrl(`${config.endpoints.products.update}/${productData.id}`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('✅ Produto atualizado com sucesso!');
    return response.ok ? { success: true } : await response.json();
  },

  /**
   * Excluir produto
   */
  async deleteProduct(productId, token) {
    console.log('🗑️ Excluindo produto...', productId);

    const response = await makeRequest(
      buildApiUrl(`${config.endpoints.products.delete}/${productId}`),
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Produto excluído com sucesso!');
    return response.ok;
  }
};

/**
 * Funções utilitárias para verificação de erros
 */

// Categoria
export const isCategoryWithProductsError = (error) => {
  return error instanceof ApiError && error.code === API_ERROR_CODES.CATEGORY_WITH_PRODUCTS;
};

// Subcategoria
export const isSubcategoryWithProductsError = (error) => {
  return error instanceof ApiError && error.code === API_ERROR_CODES.SUBCATEGORY_WITH_PRODUCTS;
};

// Autenticação
export const isAuthError = (error) => {
  return error instanceof ApiError && 
    (error.status === API_ERROR_CODES.UNAUTHORIZED || error.status === API_ERROR_CODES.FORBIDDEN);
};

// Produto
export const isProductError = (error) => {
  return error instanceof ApiError && (
    error.code === API_ERROR_CODES.PRODUCT_INVALID_CATEGORY ||
    error.code === API_ERROR_CODES.PRODUCT_DUPLICATE_NAME ||
    error.code === API_ERROR_CODES.PRODUCT_INVALID_COLOR ||
    error.code === API_ERROR_CODES.PRODUCT_DUPLICATE_COLOR
  );
};

/**
 * Função para normalizar dados de subcategoria
 */
export const normalizeSubcategoryData = (subcategory) => {
  return {
    id: subcategory.id,
    name: subcategory.name || subcategory.nome,
    nome: subcategory.name || subcategory.nome,
    categoryId: subcategory.categoryId || subcategory.categoria_id,
    categoria_id: subcategory.categoryId || subcategory.categoria_id,
    categoryName: subcategory.categoryName || subcategory.categoria_nome,
    categoria_nome: subcategory.categoryName || subcategory.categoria_nome,
    createdAt: subcategory.createdAt || subcategory.created_at,
    created_at: subcategory.createdAt || subcategory.created_at,
    updatedAt: subcategory.updatedAt || subcategory.updated_at,
    updated_at: subcategory.updatedAt || subcategory.updated_at
  };
};