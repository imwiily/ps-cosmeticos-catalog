/**
 * Página Dashboard
 * Página principal com visão geral do sistema
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { useSidebar } from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatsCards from '../components/dashboard/StatsCards';
import ProductStatsCards from '../components/dashboard/ProductStatsCards';
import RecentCategories from '../components/dashboard/RecentCategories';
import RecentProducts from '../components/dashboard/RecentProducts';
import SystemStatus from '../components/common/SystemStatus';
import { AuthLayout } from '../components/common/ProtectedRoute';
import { DashboardPageSkeleton } from '../components/common/LoadingSkeleton';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ROUTES } from '../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const sidebar = useSidebar();
  const { loading: categoriesLoading } = useCategories();
  const { loading: productsLoading, getCategoryByName } = useProducts();

  const isLoading = categoriesLoading || productsLoading;

  // Handlers
  const handleCreateCategory = () => {
    console.log('📝 Redirecionando para criação de categoria');
    navigate(ROUTES.CATEGORIES);
  };

  const handleCreateProduct = () => {
    console.log('📦 Redirecionando para criação de produto');
    navigate(ROUTES.PRODUCTS);
  };

  const handleCategoryClick = (category) => {
    console.log('👁️ Visualizando categoria:', category.nome || category.name);
    navigate(ROUTES.CATEGORIES);
  };

  const handleProductClick = (product) => {
    console.log('👁️ Visualizando produto:', product.nome || product.name);
    navigate(ROUTES.PRODUCTS);
  };

  // Se ainda está carregando dados iniciais
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

          {/* Main content loading */}
          <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
            <Header onMenuClick={sidebar.open} />
            <main className="flex-1 px-4 py-6 lg:px-8">
              <DashboardPageSkeleton />
            </main>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Header */}
          <Header 
            onMenuClick={sidebar.open}
            onCreateClick={handleCreateCategory}
          />

          {/* Content */}
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="space-y-8">
              {/* Cards de Estatísticas de Categorias */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas de Categorias</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCards />
                </div>
              </div>

              {/* Cards de Estatísticas de Produtos */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas de Produtos</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProductStatsCards />
                </div>
              </div>

              {/* Seção de Recentes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categorias Recentes */}
                <RecentCategories 
                  onCategoryClick={handleCategoryClick}
                  onCreateClick={handleCreateCategory}
                />

                {/* Produtos Recentes */}
                <RecentProducts 
                  limit={5}
                  onProductClick={handleProductClick}
                  onCreateClick={handleCreateProduct}
                  getCategoryById={getCategoryByName} // Usando getCategoryByName para compatibilidade
                />
              </div>

              {/* Seção de Resumo/Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card de Atividade Recente */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Sistema iniciado com sucesso</span>
                      <span className="ml-auto text-xs">Agora</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Dashboard de produtos implementado</span>
                      <span className="ml-auto text-xs">Hoje</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Sistema de categorias funcionando</span>
                      <span className="ml-auto text-xs">Hoje</span>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        Mais atividades aparecerão aqui conforme você usar o sistema.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card de Ações Rápidas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateCategory}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Criar Nova Categoria</p>
                        <p className="text-sm text-gray-500">Adicione uma nova categoria de produtos</p>
                      </div>
                    </button>

                    <button
                      onClick={handleCreateProduct}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Criar Novo Produto</p>
                        <p className="text-sm text-gray-500">Adicione um novo produto ao catálogo</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate(ROUTES.CATEGORIES)}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">📋</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Gerenciar Categorias</p>
                        <p className="text-sm text-gray-500">Visualizar e editar categorias existentes</p>
                      </div>
                    </button>

                    <button
                      onClick={() => navigate(ROUTES.PRODUCTS)}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">📦</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Gerenciar Produtos</p>
                        <p className="text-sm text-gray-500">Visualizar e editar produtos do catálogo</p>
                      </div>
                    </button>

                    <div className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg opacity-50">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-bold">⚙️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Configurações</p>
                        <p className="text-sm text-gray-400">Em breve - configurações do sistema</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé com informações do sistema */}
              <SystemStatus />
            </div>
          </main>
        </div>
      </div>
    </AuthLayout>
  );
};

// Componente simplificado do dashboard (para embarcamento)
export const SimpleDashboard = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`space-y-6 ${className}`}>
      <StatsCards />
      <ProductStatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCategories 
          limit={3}
          showViewAll={false}
          onCategoryClick={() => navigate(ROUTES.CATEGORIES)}
        />
        <RecentProducts 
          limit={3}
          showViewAll={false}
          onProductClick={() => navigate(ROUTES.PRODUCTS)}
        />
      </div>
    </div>
  );
};

// Hook para lógica do dashboard
export const useDashboard = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, stats: categoryStats } = useCategories();
  const { products, loading: productsLoading, stats: productStats } = useProducts();

  const quickActions = [
    {
      id: 'create-category',
      title: 'Criar Categoria',
      description: 'Adicionar nova categoria',
      action: () => navigate(ROUTES.CATEGORIES),
      color: 'purple'
    },
    {
      id: 'create-product',
      title: 'Criar Produto',
      description: 'Adicionar novo produto',
      action: () => navigate(ROUTES.PRODUCTS),
      color: 'blue'
    },
    {
      id: 'manage-categories',
      title: 'Gerenciar Categorias',
      description: 'Ver todas as categorias',
      action: () => navigate(ROUTES.CATEGORIES),
      color: 'purple'
    },
    {
      id: 'manage-products',
      title: 'Gerenciar Produtos',
      description: 'Ver todos os produtos',
      action: () => navigate(ROUTES.PRODUCTS),
      color: 'blue'
    }
  ];

  const systemStatus = {
    isOnline: true,
    lastUpdate: new Date(),
    categoriesCount: categories.length,
    productsCount: products.length,
    activeCategories: categoryStats.active || 0,
    activeProducts: productStats.active || 0
  };

  return {
    categories,
    products,
    loading: categoriesLoading || productsLoading,
    categoryStats,
    productStats,
    quickActions,
    systemStatus,
    navigate
  };
};

export default DashboardPage;