/**
 * Componente Header
 * Cabeçalho superior da aplicação com navegação mobile
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Bell, User } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

// Configuração de páginas
const pageConfig = {
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    subtitle: 'Visão geral do sistema',
    showCreateButton: true,
    createLabel: 'Nova Categoria'
  },
  [ROUTES.CATEGORIES]: {
    title: 'Gerenciar Categorias',
    subtitle: 'Gerencie suas categorias de produtos',
    showCreateButton: true,
    createLabel: 'Nova Categoria'
  },
  [ROUTES.PRODUCTS]: {
    title: 'Gerenciar Produtos',
    subtitle: 'Gerencie seu catálogo de produtos',
    showCreateButton: true,
    createLabel: 'Novo Produto'
  },
  [ROUTES.SETTINGS]: {
    title: 'Configurações',
    subtitle: 'Configurações do sistema',
    showCreateButton: false
  }
};

// Componente de título da página
const PageTitle = ({ title, subtitle }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {subtitle && (
      <p className="text-sm text-gray-500">{subtitle}</p>
    )}
  </div>
);

// Componente de ações rápidas
const QuickActions = ({ showCreateButton, createLabel, onCreateClick }) => {
  if (!showCreateButton) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onCreateClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{createLabel}</span>
      </button>
    </div>
  );
};

// Componente de notificações (futuro)
const NotificationButton = ({ count = 0, onClick }) => (
  <button
    onClick={onClick}
    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    title="Notificações"
  >
    <Bell className="w-5 h-5" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </button>
);

// Componente de perfil do usuário (futuro)
const UserButton = ({ user, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    title="Perfil do usuário"
  >
    <User className="w-5 h-5" />
    {user?.name && (
      <span className="hidden md:inline text-sm font-medium">
        {user.name}
      </span>
    )}
  </button>
);

// Componente principal do Header
const Header = ({ 
  onMenuClick, 
  onCreateClick, 
  user = null,
  notificationCount = 0,
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obter configuração da página atual
  const currentPageConfig = pageConfig[location.pathname] || {
    title: 'Página',
    subtitle: '',
    showCreateButton: false
  };

  // Handlers
  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      // Comportamento padrão baseado na rota
      if (location.pathname === ROUTES.DASHBOARD) {
        navigate(ROUTES.CATEGORIES);
      } else if (location.pathname === ROUTES.CATEGORIES) {
        // Já está na página de categorias, não fazer nada
      } else if (location.pathname === ROUTES.PRODUCTS) {
        // Já está na página de produtos, não fazer nada
      }
    }
  };

  const handleNotificationClick = () => {
    console.log('🔔 Notificações clicadas');
    // Implementar abertura de painel de notificações
  };

  const handleUserClick = () => {
    console.log('👤 Perfil clicado');
    // Implementar menu de perfil/configurações
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-4 py-4 lg:px-8 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Lado esquerdo - Menu Mobile + Título */}
        <div className="flex items-center gap-4">
          {/* Botão Menu Mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Título da Página */}
          <PageTitle 
            title={currentPageConfig.title}
            subtitle={currentPageConfig.subtitle}
          />
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-2">
          {/* Ações Rápidas */}
          <QuickActions
            showCreateButton={currentPageConfig.showCreateButton}
            createLabel={currentPageConfig.createLabel}
            onCreateClick={handleCreateClick}
          />

          {/* Separador */}
          {currentPageConfig.showCreateButton && (
            <div className="hidden sm:block w-px h-6 bg-gray-300 mx-2" />
          )}

          {/* Notificações */}
          <NotificationButton 
            count={notificationCount}
            onClick={handleNotificationClick}
          />

          {/* Perfil do Usuário */}
          <UserButton 
            user={user}
            onClick={handleUserClick}
          />
        </div>
      </div>
    </header>
  );
};

// Componente de breadcrumb (futuro)
export const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();
  
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {item.href ? (
            <button 
              onClick={() => navigate(item.href)}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Hook para usar header de forma simplificada
export const useHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPageConfig = () => {
    return pageConfig[location.pathname] || {
      title: 'Página',
      subtitle: '',
      showCreateButton: false
    };
  };

  const navigateToCreate = () => {
    if (location.pathname === ROUTES.DASHBOARD) {
      navigate(ROUTES.CATEGORIES);
    } else if (location.pathname === ROUTES.CATEGORIES) {
      // Trigger modal de criação de categoria
    } else if (location.pathname === ROUTES.PRODUCTS) {
      // Trigger modal de criação de produto
    }
  };

  return {
    currentPage: getCurrentPageConfig(),
    navigateToCreate,
    isOnDashboard: location.pathname === ROUTES.DASHBOARD,
    isOnCategories: location.pathname === ROUTES.CATEGORIES,
    isOnProducts: location.pathname === ROUTES.PRODUCTS,
    isOnSettings: location.pathname === ROUTES.SETTINGS
  };
};

// Componente simplificado para páginas específicas
export const DashboardHeader = ({ onMenuClick, onCreateClick }) => (
  <Header 
    onMenuClick={onMenuClick}
    onCreateClick={onCreateClick}
  />
);

export const CategoriesHeader = ({ onMenuClick, onCreateClick }) => (
  <Header 
    onMenuClick={onMenuClick}
    onCreateClick={onCreateClick}
  />
);

export const ProductsHeader = ({ onMenuClick, onCreateClick }) => (
  <Header 
    onMenuClick={onMenuClick}
    onCreateClick={onCreateClick}
  />
);

export default Header;