// src/pages/CatalogHomePage.jsx - Versão com dados da API
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Tag, Star } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/LoadingComponents';

const CatalogHomePage = ({ 
  onNavigateToCategories, 
  categorias = [], 
  loading = false,
  error = null 
}) => {
  // Calcular estatísticas baseado nos dados reais da API
  const totalProdutos = categorias.reduce((acc, cat) => acc + (cat.totalProdutos || 0), 0);
  const totalSubcategorias = categorias.filter(cat => cat.nome !== 'Todos').length;

  // Função para obter ícone baseado no nome da categoria
  const getCategoryIcon = (nome) => {
    const icons = {
      'Skincare': '✨',
      'Haircare': '💇‍♀️', 
      'Maquiagem': '💄',
      'Fragrâncias': '🌸',
      'Corpo e Banho': '🛁',
      'Unhas': '💅',
      'Todos': '📦'
    };
    return icons[nome] || '🛍️';
  };

  // Função para obter cor baseado no nome da categoria
  const getCategoryColor = (nome) => {
    const colors = {
      'Skincare': '#FFE4E1',
      'Haircare': '#E6F3FF',
      'Maquiagem': '#FFF0E6', 
      'Fragrâncias': '#F5E6FF',
      'Corpo e Banho': '#E6FFE6',
      'Unhas': '#FFE6F0',
      'Todos': '#F0F8FF'
    };
    return colors[nome] || '#F0F8FF';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
        <Header />
        <ErrorMessage 
          error={error} 
          title="Erro ao carregar catálogo"
          onRetry={() => window.location.reload()}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-800 mb-6">
            Catálogo PS Cosméticos ✨
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore nossa coleção completa de produtos de <span className="font-semibold">beleza</span> e <span className="font-semibold">autocuidado</span>. 
            Navegue por categorias e descubra produtos perfeitos para você.
          </p>
          
          <button
            onClick={onNavigateToCategories}
            disabled={loading}
            className="bg-gradient-to-r from-amber-300 to-rose-300 text-amber-800 px-10 py-5 rounded-full text-xl font-semibold hover:from-amber-400 hover:to-rose-400 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : 'Explorar por Categorias 🗂️'}
          </button>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-800 text-center mb-12">Nosso Catálogo em Números</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-800 mb-2">{totalProdutos}</div>
                <div className="text-amber-600 font-medium">Produtos Disponíveis</div>
                <div className="text-amber-500 text-sm mt-1">Constantemente atualizado</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Tag size={32} className="text-rose-600" />
                </div>
                <div className="text-3xl font-bold text-amber-800 mb-2">{categorias.filter(cat => cat.nome !== 'Todos').length}</div>
                <div className="text-amber-600 font-medium">Categorias Principais</div>
                <div className="text-amber-500 text-sm mt-1">Skincare, Haircare, Maquiagem...</div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-amber-800 mb-2">{totalSubcategorias}</div>
                <div className="text-amber-600 font-medium">Categorias</div>
                <div className="text-amber-500 text-sm mt-1">Para você encontrar exatamente o que precisa</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Preview das Categorias */}
      <section className="py-16 px-4 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-800 text-center mb-12">Principais Categorias</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {categorias.filter(cat => cat.nome !== 'Todos').slice(0, 4).map((categoria) => (
                <div
                  key={categoria.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={onNavigateToCategories}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ backgroundColor: getCategoryColor(categoria.nome) }}
                  >
                    {getCategoryIcon(categoria.nome)}
                  </div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">{categoria.nome}</h3>
                  <p className="text-amber-600 text-sm mb-3">{categoria.totalProdutos} produtos</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={onNavigateToCategories}
              disabled={loading}
              className="bg-gradient-to-r from-rose-400 to-amber-400 text-white px-8 py-3 rounded-full hover:from-rose-500 hover:to-amber-500 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
            >
              Ver Todas as Categorias →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CatalogHomePage;