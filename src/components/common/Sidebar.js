/**
 * Componente Sidebar - ATUALIZADO
 * Menu lateral de navegação da aplicação com tipos de imagem
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  Package,
  Settings, 
  LogOut, 
  Tag,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCategoriesList } from '../../hooks/useCategories';
import { useProductsList } from '../../hooks/useProducts';
import { getIconUrl } from '../../utils/config'; // NOVO: Importar função de imagem
import { config } from '../../utils/config';
import { ROUTES } from '../../utils/constants';

// Itens de navegação
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    route: ROUTES.DASHBOARD,
    description: 'Visão geral do sistema'
  },
  {
    id: 'categories',
    label: 'Categorias',
    icon: List,
    route: ROUTES.CATEGORIES,
    description: 'Gerenciar categorias'
  },
  {
    id: 'products',
    label: 'Produtos',
    icon: Package,
    route: ROUTES.PRODUCTS,
    description: 'Gerenciar produtos'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    route: ROUTES.SETTINGS,
    description: 'Configurações do sistema',
    disabled: true,
    badge: 'Em breve'
  }
];

// Componente de item de navegação
const NavigationItem = ({ 
  item, 
  isActive, 
  onClick, 
  disabled = false 
}) => {
  const IconComponent = item.icon;
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
        ${isActive 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
      title={item.description}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium flex-1">{item.label}</span>
      
      {item.badge && (
        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.badge}
        </span>
      )}
    </button>
  );
};

// Componente de mini estatísticas com imagens - NOVO
const MiniStatsWithImages = ({ className = '' }) => {
  const { categories, loading: categoriesLoading } = useCategoriesList();
  const { products, loading: productsLoading } = useProductsList();

  if (categoriesLoading || productsLoading) {
    return (
      <div className={`px-4 space-y-2 ${className}`}>
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-8 mt-1"></div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-8 mt-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 space-y-2 ${className}`}>
      {/* Categorias */}
      <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          {categories.length > 0 && categories[0].imageUrl ? (
            <img 
              src={getIconUrl(categories[0].imageUrl)} // NOVO: Usando ICON para sidebar
              alt="Categoria"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <List className="w-4 h-4 text-purple-600" style={{ display: (categories.length > 0 && categories[0].imageUrl) ? 'none' : 'block' }} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600">Categorias</p>
          <p className="text-sm font-bold text-purple-600">{categories.length}</p>
        </div>
      </div>
      
      {/* Produtos */}
      <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          {products.length > 0 && (products[0].imageUrl || products[0].imageURL) ? (
            <img 
              src={getIconUrl(products[0].imageUrl || products[0].imageURL)} // NOVO: Usando ICON para sidebar
              alt="Produto"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <Package className="w-4 h-4 text-blue-600" style={{ display: (products.length > 0 && (products[0].imageUrl || products[0].imageURL)) ? 'none' : 'block' }} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600">Produtos</p>
          <p className="text-sm font-bold text-blue-600">{products.length}</p>
        </div>
      </div>
    </div>
  );
};

// Componente de categorias recentes na sidebar - ATUALIZADO COM TIPOS DE IMAGEM
const SidebarCategoryList = ({ limit = 3, className = '' }) => {
  const { categories, loading } = useCategoriesList();
  const navigate = useNavigate();
  const recentCategories = categories.slice(0, limit);

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: limit }, (_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded animate-pulse">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recentCategories.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Tag className="w-6 h-6 mx-auto mb-2 text-gray-300" />
        <p className="text-xs text-gray-500">Nenhuma categoria</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {recentCategories.map(category => (
        <div 
          key={category.id} 
          onClick={() => navigate(ROUTES.CATEGORIES)}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
            {category.imageUrl ? (
              <img 
                src={getIconUrl(category.imageUrl)} // NOVO: Usando ICON para sidebar
                alt={category.nome || category.name}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Tag className="w-3 h-3 text-purple-600" style={{ display: category.imageUrl ? 'none' : 'block' }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-700 truncate block">
              {category.nome || category.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente principal do Sidebar
const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Verificar item ativo baseado na rota atual
  const getActiveItem = () => {
    return navigationItems.find(item => location.pathname === item.route)?.id || null;
  };

  // Navegar para rota
  const handleNavigation = (route) => {
    navigate(route);
    if (onClose) {
      onClose(); // Fechar sidebar em mobile
    }
  };

  // Fazer logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    if (onClose) {
      onClose();
    }
  };

  const activeItem = getActiveItem();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Gestão</h1>
                <p className="text-xs text-gray-500">v{config.dashboard.version}</p>
              </div>
            </div>

            {/* Botão fechar (mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegação Principal */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => handleNavigation(item.route)}
                disabled={item.disabled}
              />
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Seção de estatísticas */}
            <div className="text-xs text-gray-400 px-4 py-2 uppercase tracking-wider font-semibold">
              Estatísticas
            </div>
            
            {/* Mini estatísticas com imagens */}
            <MiniStatsWithImages />

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Seção de categorias recentes */}
            <div className="text-xs text-gray-400 px-4 py-2 uppercase tracking-wider font-semibold">
              Categorias Recentes
            </div>
            
            <SidebarCategoryList className="px-4" />
          </nav>

          {/* Footer com Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente simplificado para desktop apenas
export const DesktopSidebar = ({ className = '' }) => {
  return (
    <Sidebar 
      isOpen={true} 
      onClose={() => {}} 
      className={`hidden lg:flex ${className}`} 
    />
  );
};

// Componente para mobile
export const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <div className="lg:hidden">
      <Sidebar isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

// Hook para controlar estado do sidebar
export const useSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default Sidebar;