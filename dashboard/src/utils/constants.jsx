/**
 * Constantes do Sistema - ATUALIZADO
 * Valores fixos utilizados em toda a aplicação
 * 
 * NOVO: Constantes para subcategorias
 */

// Tipos de toast/notificação
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Status de categoria/produto
export const CATEGORY_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

export const PRODUCT_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

// Tipos de produto
export const PRODUCT_TYPES = {
  STATIC: 'STATIC',           // Produto simples, sem variações
  MULTI_COLOR: 'MULTI_COLOR'  // Produto com múltiplas cores
};

// Labels dos tipos de produto
export const PRODUCT_TYPE_LABELS = {
  [PRODUCT_TYPES.STATIC]: 'Produto Simples',
  [PRODUCT_TYPES.MULTI_COLOR]: 'Produto Multi-Cor'
};

// Cores predefinidas para seleção rápida
export const PREDEFINED_COLORS = {
  // Cores básicas
  'Branco': '#FFFFFF',
  'Preto': '#000000',
  'Cinza': '#808080',
  
  // Cores primárias
  'Vermelho': '#FF0000',
  'Verde': '#00FF00',
  'Azul': '#0000FF',
  
  // Cores secundárias
  'Amarelo': '#FFFF00',
  'Magenta': '#FF00FF',
  'Ciano': '#00FFFF',
  
  // Tons de pele/naturais
  'Bege': '#F5F5DC',
  'Marrom': '#8B4513',
  'Rosa': '#FFC0CB',
  'Dourado': '#FFD700',
  'Prateado': '#C0C0C0',
  
  // Cores modernas
  'Azul Marinho': '#000080',
  'Verde Militar': '#556B2F',
  'Roxo': '#800080',
  'Laranja': '#FFA500',
  'Turquesa': '#40E0D0'
};

// Filtros de status
export const STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Tipos de imagem para otimização
export const IMAGE_TYPES = {
  ICON: 'ICON',           // Ícones pequenos (16x16, 24x24, 32x32)
  MID_DISPLAY: 'MID-DISPLAY', // Resolução média (64x64, 128x128, 256x256)
  DISPLAY: 'DISPLAY'      // Alta resolução (512x512+, original)
};

// Contextos de uso de imagem
export const IMAGE_CONTEXTS = {
  // Ícones pequenos
  SIDEBAR_ICON: IMAGE_TYPES.ICON,
  BREADCRUMB_ICON: IMAGE_TYPES.ICON,
  BUTTON_ICON: IMAGE_TYPES.ICON,
  
  // Resolução média
  TABLE_THUMBNAIL: IMAGE_TYPES.MID_DISPLAY,
  CARD_IMAGE: IMAGE_TYPES.MID_DISPLAY,
  LIST_ITEM: IMAGE_TYPES.MID_DISPLAY,
  AVATAR: IMAGE_TYPES.MID_DISPLAY,
  
  // Alta resolução
  MODAL_IMAGE: IMAGE_TYPES.DISPLAY,
  GALLERY: IMAGE_TYPES.DISPLAY,
  DETAIL_VIEW: IMAGE_TYPES.DISPLAY,
  PREVIEW: IMAGE_TYPES.DISPLAY
};

// Views/páginas disponíveis
export const VIEWS = {
  DASHBOARD: 'dashboard',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  SETTINGS: 'settings'
};

// Rotas da aplicação
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard', 
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  SETTINGS: '/settings',
  ROOT: '/'
};

// Mensagens padrão
export const MESSAGES = {
  LOGIN: {
    SUCCESS: 'Login realizado com sucesso!',
    ERROR: 'Credenciais inválidas',
    MISSING_FIELDS: 'Preencha todos os campos',
    CONNECTION_ERROR: 'Erro de conexão com o servidor',
    TOKEN_ERROR: 'Token não recebido do servidor'
  },
  CATEGORY: {
    CREATE_SUCCESS: 'Categoria criada com sucesso!',
    UPDATE_SUCCESS: 'Categoria atualizada com sucesso!',
    DELETE_SUCCESS: 'Categoria excluída com sucesso!',
    CREATE_ERROR: 'Erro ao criar categoria',
    UPDATE_ERROR: 'Erro ao atualizar categoria',
    DELETE_ERROR: 'Erro ao excluir categoria',
    LOAD_ERROR: 'Erro ao carregar categorias',
    DELETE_WITH_PRODUCTS: 'Não é possível excluir esta categoria porque existem produtos cadastrados nela. Remova ou transfira os produtos primeiro.',
    NAME_REQUIRED: 'Nome da categoria é obrigatório',
    DESCRIPTION_REQUIRED: 'Descrição da categoria é obrigatória',
    IMAGE_REQUIRED: 'Imagem é obrigatória para novas categorias'
  },
  // NOVO: Mensagens para subcategorias
  SUBCATEGORY: {
    CREATE_SUCCESS: 'Subcategoria criada com sucesso!',
    UPDATE_SUCCESS: 'Subcategoria atualizada com sucesso!',
    DELETE_SUCCESS: 'Subcategoria excluída com sucesso!',
    CREATE_ERROR: 'Erro ao criar subcategoria',
    UPDATE_ERROR: 'Erro ao atualizar subcategoria',
    DELETE_ERROR: 'Erro ao excluir subcategoria',
    LOAD_ERROR: 'Erro ao carregar subcategorias',
    DELETE_WITH_PRODUCTS: 'Não é possível excluir esta subcategoria porque existem produtos cadastrados nela. Remova ou transfira os produtos primeiro.',
    NAME_REQUIRED: 'Nome da subcategoria é obrigatório',
    CATEGORY_REQUIRED: 'Categoria é obrigatória'
  },
  PRODUCT: {
    CREATE_SUCCESS: 'Produto criado com sucesso!',
    UPDATE_SUCCESS: 'Produto atualizado com sucesso!',
    DELETE_SUCCESS: 'Produto excluído com sucesso!',
    CREATE_ERROR: 'Erro ao criar produto',
    UPDATE_ERROR: 'Erro ao atualizar produto',
    DELETE_ERROR: 'Erro ao excluir produto',
    LOAD_ERROR: 'Erro ao carregar produtos',
    NAME_REQUIRED: 'Nome do produto é obrigatório',
    DESCRIPTION_REQUIRED: 'Descrição do produto é obrigatória',
    CATEGORY_REQUIRED: 'Categoria é obrigatória',
    PRICE_REQUIRED: 'Preço é obrigatório e deve ser maior que zero',
    IMAGE_REQUIRED: 'Imagem é obrigatória para novos produtos',
    INVALID_PRICE: 'Preço deve ser um número válido maior que zero',
    // Mensagens para produtos multi-cor
    TYPE_REQUIRED: 'Tipo de produto é obrigatório',
    COLORS_REQUIRED: 'Pelo menos uma cor é obrigatória para produtos multi-cor',
    COLOR_NAME_REQUIRED: 'Nome da cor é obrigatório',
    COLOR_HEX_REQUIRED: 'Código da cor é obrigatório',
    COLOR_HEX_INVALID: 'Código da cor deve ser um hexadecimal válido',
    DUPLICATE_COLOR_NAME: 'Já existe uma cor com este nome'
  },
  GENERAL: {
    LOADING: 'Carregando...',
    CONNECTION_ERROR: 'Erro de conexão',
    UNEXPECTED_ERROR: 'Erro inesperado',
    NO_DATA: 'Nenhum dado encontrado',
    CONFIRM_DELETE: 'Tem certeza que deseja excluir?',
    ACTION_IRREVERSIBLE: 'Esta ação não pode ser desfeita.'
  }
};

// Configurações de UI
export const UI_CONFIG = {
  TOAST_DURATION: 4000, // 4 segundos
  DEBOUNCE_DELAY: 300, // 300ms para busca
  SKELETON_ROWS: 3, // Linhas do skeleton loader
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  SIDEBAR_MOBILE_BREAKPOINT: 1024, // lg breakpoint do Tailwind
  CURRENCY_LOCALE: 'pt-BR',
  CURRENCY_CODE: 'BRL',
  // Configurações para cores
  MAX_COLORS_PER_PRODUCT: 10, // Máximo de cores por produto
  COLOR_PICKER_SIZE: 40, // Tamanho do seletor de cor em pixels
  DEFAULT_COLOR: '#000000', // Cor padrão
  // NOVO: Configurações para subcategorias
  MAX_SUBCATEGORIES_PER_CATEGORY: 50, // Máximo de subcategorias por categoria
  SUBCATEGORY_NAME_MAX_LENGTH: 100 // Máximo de caracteres no nome
};

// Classes CSS padrão (para reutilização)
export const CSS_CLASSES = {
  BUTTON: {
    PRIMARY: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200',
    SECONDARY: 'border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors',
    DANGER: 'bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors',
    ICON: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors',
    // Botão para cores
    COLOR: 'w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-500 transition-colors',
    COLOR_SELECTED: 'w-8 h-8 rounded-full border-2 border-purple-500 cursor-pointer ring-2 ring-purple-200'
  },
  INPUT: {
    DEFAULT: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    ERROR: 'w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
    // Input para cor
    COLOR: 'w-16 h-10 border border-gray-300 rounded cursor-pointer'
  },
  CARD: {
    DEFAULT: 'bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow',
    STATS: 'bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow'
  },
  STATUS: {
    ACTIVE: 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
    INACTIVE: 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
  },
  // Classes para produtos multi-cor
  PRODUCT_TYPE: {
    STATIC: 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    MULTI_COLOR: 'px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  },
  // NOVO: Classes para subcategorias
  SUBCATEGORY: {
    ITEM: 'flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors',
    SELECTED: 'flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded-lg ring-1 ring-purple-500',
    BADGE: 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
  }
};

// Códigos de erro da API
export const API_ERROR_CODES = {
  CATEGORY_WITH_PRODUCTS: 'C.ITDx0001',
  PRODUCT_INVALID_CATEGORY: 'P.ITDx0001',
  PRODUCT_DUPLICATE_NAME: 'P.ITDx0002',
  // Códigos para produtos multi-cor
  PRODUCT_INVALID_COLOR: 'P.ITDx0003',
  PRODUCT_DUPLICATE_COLOR: 'P.ITDx0004',
  // NOVO: Códigos para subcategorias
  SUBCATEGORY_WITH_PRODUCTS: 'S.ITDx0001',
  SUBCATEGORY_DUPLICATE_NAME: 'S.ITDx0002',
  SUBCATEGORY_INVALID_CATEGORY: 'S.ITDx0003',
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};