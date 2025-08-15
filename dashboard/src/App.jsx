/**
 * App.js - Router Principal da Aplicação
 * Configuração de rotas e providers globais
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ToastProvider from './components/common/ToastProvider';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import { ROUTES } from './utils/constants';

// Página de configurações (placeholder)
const SettingsPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">⚙️</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Configurações</h2>
      <p className="text-gray-500 mb-4">Esta página será implementada em breve.</p>
      <button 
        onClick={() => window.history.back()}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Voltar
      </button>
    </div>
  </div>
);

// Página 404
const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-red-600 text-2xl">❌</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Página não encontrada</h2>
      <p className="text-gray-500 mb-4">A página que você está procurando não existe.</p>
      <button 
        onClick={() => window.location.href = ROUTES.LOGIN}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Ir para Login
      </button>
    </div>
  </div>
);

// Componente de rota inteligente que aguarda o AuthContext
const SmartRoute = ({ children }) => {
  const { isLoading, isAuthenticated: authStatus } = useAuth();
  
  console.log('🔍 SmartRoute - isLoading:', isLoading, 'isAuthenticated:', authStatus);
  
  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Carregando Sistema...</h2>
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Se não autenticado, ir para login
  if (!authStatus) {
    console.log('🔐 SmartRoute: Não autenticado, redirecionando para login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  // Se autenticado, mostrar conteúdo
  console.log('✅ SmartRoute: Usuário autenticado, mostrando conteúdo');
  return children;
};

// Componente principal da aplicação
function App() {
  console.log('🚀 App.js carregado');
  console.log('📍 Rotas configuradas:', ROUTES);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota de login - acessível apenas quando NÃO autenticado */}
              <Route 
                path={ROUTES.LOGIN} 
                element={<LoginPage />}
              />

              {/* Rota raiz - redireciona inteligentemente */}
              <Route 
                path={ROUTES.ROOT} 
                element={<SmartRoute><Navigate to={ROUTES.DASHBOARD} replace /></SmartRoute>} 
              />

              {/* Rotas protegidas - só acessíveis se autenticado */}
              <Route 
                path={ROUTES.DASHBOARD} 
                element={
                  <SmartRoute>
                    <DashboardPage />
                  </SmartRoute>
                } 
              />

              <Route 
                path={ROUTES.CATEGORIES} 
                element={
                  <SmartRoute>
                    <CategoriesPage />
                  </SmartRoute>
                } 
              />

              <Route 
                path={ROUTES.PRODUCTS} 
                element={
                  <SmartRoute>
                    <ProductsPage />
                  </SmartRoute>
                } 
              />

              <Route 
                path={ROUTES.SETTINGS} 
                element={
                  <SmartRoute>
                    <SettingsPage />
                  </SmartRoute>
                } 
              />

              {/* Rota 404 - deve ser a última */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;