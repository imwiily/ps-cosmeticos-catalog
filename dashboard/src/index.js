/**
 * index.js - Ponto de Entrada da Aplicação
 * Configuração principal e renderização do React
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configurações globais
console.log('🚀 Iniciando Dashboard de Gestão de Categorias v2.3.28');

// Error boundary para capturar erros globais
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 Erro capturado pelo Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-600 text-2xl">💥</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Algo deu errado</h2>
            <p className="text-gray-500 mb-4">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Recarregar Página
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Criar root e renderizar aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Métricas de performance (opcional)
reportWebVitals(console.log);

// Log de inicialização
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Modo desenvolvimento ativo');
  console.log('📍 API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8080');
}

console.log('✅ Aplicação inicializada com sucesso');