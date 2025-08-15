import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, ArrowLeft, Package, Grid3x3 } from 'lucide-react';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/ui/LoadingComponents';

const SubcategoriesSelectionPage = ({ 
  selectedCategory,
  subcategorias = [],
  onSubcategorySelect,
  onViewAllProducts,
  onBackToCategories,
  onBackToHome,
  loading = false,
  error = null
}) => {
  const SubcategoriaCard = ({ subcategoria }) => (
    <div
      onClick={() => onSubcategorySelect(subcategoria)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          🏷️
        </div>
        <ChevronRight size={24} className="text-rose-600 group-hover:translate-x-1 transition-transform" />
      </div>

      <h3 className="text-xl font-semibold text-amber-800 mb-2">{subcategoria.nome}</h3>
      <p className="text-amber-600 text-sm mb-3">
        {subcategoria.descricao || `Produtos específicos de ${subcategoria.nome.toLowerCase()}`}
      </p>
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <Package size={16} />
        <span>Ver produtos</span>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
        <Header onBackToHome={onBackToHome} showBackButton={true} />
        <ErrorMessage 
          error={error} 
          title="Erro ao carregar subcategorias"
          onRetry={() => window.location.reload()}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header onBackToHome={onBackToHome} showBackButton={true} />

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
            <button
              onClick={onBackToCategories}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              Categorias
            </button>
            <ChevronRight size={16} className="text-amber-600" />
            <span className="text-amber-800 font-medium">{selectedCategory?.nome}</span>
          </div>
        </div>
      </div>

      {/* Header da Página */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-serif text-amber-800 mb-2">
                Subcategorias de {selectedCategory?.nome}
              </h1>
              <p className="text-amber-700 text-lg">
                Escolha uma subcategoria específica ou veja todos os produtos
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={onViewAllProducts}
                className="flex items-center gap-2 bg-rose-200 text-rose-800 px-6 py-3 rounded-full hover:bg-rose-300 transition-colors font-medium"
              >
                <Grid3x3 size={18} />
                Ver Todos os Produtos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Opção "Todos os produtos" */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div
            onClick={onViewAllProducts}
            className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-3xl p-8 cursor-pointer hover:from-amber-200 hover:to-rose-200 transition-all border-2 border-dashed border-amber-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-amber-200 rounded-2xl flex items-center justify-center text-3xl">
                  📦
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-amber-800 mb-1">
                    Todos os produtos de {selectedCategory?.nome}
                  </h3>
                  <p className="text-amber-700">
                    Ver todos os {selectedCategory?.totalProdutos || 0} produtos desta categoria
                  </p>
                </div>
              </div>
              <ChevronRight size={28} className="text-amber-600 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Subcategorias */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif text-amber-800 mb-8 text-center">
            Ou escolha uma subcategoria específica:
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : subcategorias.length === 0 ? (
            <EmptyState
              title="Sem subcategorias específicas"
              description={`A categoria ${selectedCategory?.nome} não possui subcategorias. Você pode ver todos os produtos disponíveis.`}
              icon="🏷️"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategorias.map((subcategoria) => (
                <SubcategoriaCard key={subcategoria.id} subcategoria={subcategoria} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubcategoriesSelectionPage;
