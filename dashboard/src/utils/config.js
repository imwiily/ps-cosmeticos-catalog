/**
 * Configurações Centralizadas do Dashboard
 * Versão: 2.5.1
 * Última atualização: 10/08/2025
 * 
 * CORREÇÕES v2.5.1:
 * - Criação de subcategorias funcionando
 * - Carregamento correto de subcategoria na edição de produtos
 * - Event handling aprimorado nos modais
 * - Async/await corrigido nos hooks
 */

// Configurações do Dashboard
export const config = {
  api: {
    baseUrl: 'http://localhost:8080',
    version: 'v1',
    timeout: 30000,
  },
  dashboard: {
    version: '2.5.1',
    name: 'Dashboard de Gestão de Categorias e Produtos',
    releaseDate: '10/08/2025',
    build: Date.now() // Timestamp do build
  },
  auth: {
    tokenKey: 'authToken',
  },
  endpoints: {
    login: '/login',
    health: '/health',
    categories: {
      list: '/categorias',
      create: '/categorias', 
      update: '/categorias',
      delete: '/categorias',
    },
    // Endpoints de subcategorias
    subcategories: {
      list: '/subcategorias',                    // GET /api/v1/subcategorias
      create: '/subcategorias',                  // POST /api/v1/subcategorias  
      update: '/subcategorias',                  // PUT /api/v1/subcategorias/{id}
      delete: '/subcategorias',                  // DELETE /api/v1/subcategorias/{id}
      byCategory: '/categorias/subcategorias'    // GET /api/v1/categorias/subcategorias/{categoryId}
    },
    products: {
      list: '/produtos',
      create: '/produtos',
      update: '/produtos',
      delete: '/produtos',
      getById: '/produtos',
      byCategory: '/produtos/categoria',
      search: '/produtos/search',
      toggleStatus: '/produtos/status'
    }
  },
  // Tipos de imagem
  imageTypes: {
    ICON: 'ICON',           // Para ícones pequenos (ex: categorias na sidebar)
    MID_DISPLAY: 'MID-DISPLAY', // Resolução média (ex: cards, listas)
    DISPLAY: 'DISPLAY'      // Alta resolução (ex: visualização completa)
  }
};

// Função para construir URL da API
export const buildApiUrl = (endpoint) => {
  return `${config.api.baseUrl}/api/${config.api.version}${endpoint}`;
};

/**
 * Função para normalizar URL de imagem com suporte a tipos
 * @param {string} imageUrl - URL da imagem retornada pela API
 * @param {string} type - Tipo da imagem (ICON, MID-DISPLAY, DISPLAY)
 * @returns {string|null} - URL normalizada com parâmetro de tipo
 */
export const getImageUrl = (imageUrl, type = config.imageTypes.MID_DISPLAY) => {
  if (!imageUrl) {
    return null;
  }
  
  // Se já é uma URL completa, adicionar parâmetro de tipo
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const url = new URL(imageUrl);
    url.searchParams.set('type', type);
    return url.toString();
  }
  
  // Se não tem protocolo, normalizar e adicionar tipo
  const baseUrl = `http://${imageUrl}`;
  const url = new URL(baseUrl);
  url.searchParams.set('type', type);
  return url.toString();
};

/**
 * Funções específicas para cada tipo de imagem
 */
export const getIconUrl = (imageUrl) => getImageUrl(imageUrl, config.imageTypes.ICON);
export const getMidDisplayUrl = (imageUrl) => getImageUrl(imageUrl, config.imageTypes.MID_DISPLAY);
export const getDisplayUrl = (imageUrl) => getImageUrl(imageUrl, config.imageTypes.DISPLAY);

/**
 * Hook para usar URLs de imagem de forma mais conveniente
 */
export const useImageUrl = () => {
  return {
    getIcon: (imageUrl) => getIconUrl(imageUrl),
    getMidDisplay: (imageUrl) => getMidDisplayUrl(imageUrl),
    getDisplay: (imageUrl) => getDisplayUrl(imageUrl),
    getWithType: (imageUrl, type) => getImageUrl(imageUrl, type)
  };
};