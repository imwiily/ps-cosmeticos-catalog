import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, ArrowLeft, Package, Tag } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/LoadingComponents';

const CategoriesSelectionPage = ({ 
  categorias = [], 
  onCategorySelect, 
  onBackToHome,
  loading = false,
  error = null
}) => {
  // Função para obter ícone baseado no nome da categoria
  const getCategoryIcon = (nome) => {
    const icons = {
      'Skincare': '✨',
      'Haircare': '💇‍♀️', 
      'Maquiagem': '💄',
      'Fragrâncias': '🌸',
      'Corpo e Banho': '🛁',
      'Unhas': '💅'
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
      'Unhas': '#FFE6F0'
    };
    return colors[nome] || '#F0F8FF';
  };

  const CategoriaCard = ({ categoria }) => (
    <div
      onClick={() => onCategorySelect(categoria)}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform"
          style={{ backgroundColor: getCategoryColor(categoria.nome) }}
        >
          {getCategoryIcon(categoria.nome)}
        </div>
        <ChevronRight size={28} className="text-amber-600 group-hover:translate-x-2 transition-transform" />
      </div>

      <h2 className="text-2xl font-serif text-amber-800 mb-3">{categoria.nome}</h2>
      <p className="text-amber-700 mb-6 leading-relaxed">
        {categoria.descricao || `Explore nossa seleção de produtos de ${categoria.nome.toLowerCase()}`}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <Package size={16} />
            <span>{categoria.totalProdutos || 0} produtos</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
        <Header onBackToHome={onBackToHome} showBackButton={true} />
        <ErrorMessage 
          error={error} 
          title="Erro ao carregar categorias"
          onRetry={() => window.location.reload()}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header 
        onBackToHome={onBackToHome} 
        showBackButton={true}
      />

      {/* Breadcrumb */}
      <div className="bg-white/50 border-b border-amber-100 py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onBackToHome}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              Início
            </button>
            <ChevronRight size={16} className="text-amber-600" />
            <span className="text-amber-800 font-medium">Categorias</span>
          </div>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-800 mb-4">
            Escolha uma Categoria
          </h1>
          <p className="text-xl text-amber-700 mb-8">
            Selecione a categoria que deseja explorar para descobrir produtos incríveis
          </p>
        </div>
      </section>

      {/* Grid de Categorias */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="flex gap-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categorias.filter(categoria => categoria.nome !== 'Todos').map((categoria) => (
                <CategoriaCard key={categoria.id} categoria={categoria} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoriesSelectionPage;
