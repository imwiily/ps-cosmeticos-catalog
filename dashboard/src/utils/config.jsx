/**
 * Configurações Centralizadas do Dashboard
 * Versão: 2.6.0 - Migrado para Vite + JSX
 * Última atualização: 15/08/2025
 * 
 * MIGRAÇÃO VITE v2.6.0:
 * - Atualizado para usar import.meta.env
 * - Otimizações para Vite
 * - Melhor gerenciamento de variáveis de ambiente
 * - Todas as funções de imagem exportadas
 */

// Configurações do Dashboard
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    version: 'v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  dashboard: {
    version: '2.6.0',
    name: import.meta.env.VITE_APP_NAME || 'Dashboard de Gestão de Categorias e Produtos',
    releaseDate: '15/08/2025',
    build: Date.now(), // Timestamp do build
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
    mode: import.meta.env.MODE
  },
  auth: {
    tokenKey: import.meta.env.VITE_TOKEN_KEY || 'authToken',
    tokenExpiry: parseInt(import.meta.env.VITE_TOKEN_EXPIRY) || 3600
  },
  ui: {
    toastDuration: parseInt(import.meta.env.VITE_TOAST_DURATION) || 4000,
    debounceDelay: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
    showLogs: import.meta.env.VITE_SHOW_LOGS === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
  },
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedImageTypes: import.meta.env.VITE_ALLOWED_IMAGE_TYPES?.split(',') || [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif'
    ]
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
      list: '/subcategorias',
      create: '/subcategorias',
      update: '/subcategorias',
      delete: '/subcategorias',
      byCategory: '/categorias/subcategorias'
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
export const getImageUrl = (imageUrl, type = config.imageTypes.DISPLAY) => {
  if (!imageUrl) return null;
  
  // Se já é uma URL completa, retornar como está
  if (imageUrl.startsWith('http')) {
    return `${imageUrl}?type=${type}`;
  }
  
  // Se é um caminho relativo, construir URL completa
  const baseUrl = config.api.baseUrl;
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${baseUrl}${cleanPath}?type=${type}`;
};

/**
 * Funções específicas para cada tipo de imagem
 * ESSAS SÃO AS FUNÇÕES QUE ESTÃO SENDO IMPORTADAS PELOS COMPONENTES
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

/**
 * Função para logging condicional baseado no ambiente
 */
export const logger = {
  log: (...args) => {
    if (config.ui.showLogs || config.dashboard.isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    console.error(...args);
  },
  
  warn: (...args) => {
    if (config.ui.showLogs || config.dashboard.isDevelopment) {
      console.warn(...args);
    }
  },
  
  debug: (...args) => {
    if (config.ui.debugMode && config.dashboard.isDevelopment) {
      console.debug(...args);
    }
  }
};

/**
 * Informações do build para debugging
 */
export const buildInfo = {
  version: config.dashboard.version,
  timestamp: config.dashboard.build,
  mode: config.dashboard.mode,
  isProduction: config.dashboard.isProduction,
  viteVersion: import.meta.env.VITE_VERSION || 'unknown'
};

// Log de inicialização apenas em desenvolvimento
if (config.dashboard.isDevelopment) {
  logger.log('🚀 Dashboard iniciado com Vite');
  logger.log('📦 Build Info:', buildInfo);
  logger.log('⚙️ Config:', {
    apiUrl: config.api.baseUrl,
    mode: config.dashboard.mode,
    version: config.dashboard.version
  });
}