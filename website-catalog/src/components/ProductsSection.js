import React from 'react';
import { SafeProductCard } from './ui/ProductErrorBoundary';
import { ProductCardSkeleton, ErrorMessage, EmptyState, LoadingSpinner } from './ui/LoadingComponents';

const ProductsSection = ({ 
  produtos, 
  categorias, 
  categoriaAtiva, 
  setCategoriaAtiva, 
  subcategorias = [],
  subcategoriaAtiva,
  setSubcategoriaAtiva,
  onProductClick,
  loading,
  error,
  subcategoriasLoading = false
}) => {
  return (
    <section id="produtos" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-serif text-amber-800 text-center mb-12">Nossos Produtos</h3>
        
        {/* Unified Filter Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-12">
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-amber-800 mb-4 text-center">Categorias</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => setCategoriaAtiva(categoria)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoriaAtiva === categoria
                      ? 'bg-amber-200 text-amber-800 shadow-md'
                      : 'bg-white/70 text-amber-700 hover:bg-amber-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter - Only show if there are subcategories */}
          {!subcategoriasLoading && subcategorias.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-rose-800 mb-4 text-center">
                Subcategorias {categoriaAtiva !== "Todos" && `de ${categoriaAtiva}`}
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSubcategoriaAtiva("Todas")}
                  disabled={loading}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    subcategoriaAtiva === "Todas"
                      ? 'bg-rose-200 text-rose-800 shadow-md'
                      : 'bg-white/70 text-rose-700 hover:bg-rose-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Todas
                </button>
                {subcategorias.map((subcategoria) => (
                  <button
                    key={subcategoria.id}
                    onClick={() => setSubcategoriaAtiva(subcategoria.nome)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      subcategoriaAtiva === subcategoria.nome
                        ? 'bg-rose-200 text-rose-800 shadow-md'
                        : 'bg-white/70 text-rose-700 hover:bg-rose-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {subcategoria.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subcategories Loading */}
          {subcategoriasLoading && (
            <div>
              <h4 className="text-lg font-semibold text-rose-800 mb-4 text-center">Carregando subcategorias...</h4>
              <div className="flex justify-center gap-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-8 w-20 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Display & Clear Button */}
          {(categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas") && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                {categoriaAtiva !== "Todos" && (
                  <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {categoriaAtiva}
                  </span>
                )}
                {subcategoriaAtiva !== "Todas" && (
                  <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                    {subcategoriaAtiva}
                  </span>
                )}
                <button
                  onClick={() => {
                    setCategoriaAtiva("Todos");
                    setSubcategoriaAtiva("Todas");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && !error && produtos.length > 0 && (
          <div className="text-center mb-8">
            <p className="text-amber-700 text-lg">
              {produtos.length} produto{produtos.length !== 1 ? 's' : ''} encontrado{produtos.length !== 1 ? 's' : ''}
              {categoriaAtiva !== "Todos" && ` em ${categoriaAtiva}`}
              {subcategoriaAtiva !== "Todas" && ` - ${subcategoriaAtiva}`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorMessage 
            error={error} 
            onRetry={() => window.location.reload()}
            title="Erro ao carregar produtos"
          />
        )}

        {/* Empty State */}
        {!loading && !error && produtos.length === 0 && (
          <EmptyState 
            title="Nenhum produto encontrado"
            description={
              categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas"
                ? `Não há produtos disponíveis para os filtros selecionados. Tente outras opções.`
                : "Não há produtos disponíveis no momento."
            }
            icon="📦"
          />
        )}

        {/* Products Grid */}
        {!loading && !error && produtos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.slice(0, 12).map((produto) => (
              <SafeProductCard 
                key={produto?.id || Math.random()}
                produto={produto}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {!loading && !error && produtos.length > 0 && produtos.length % 12 === 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 px-8 py-3 rounded-full hover:from-amber-300 hover:to-rose-300 transition-all font-medium">
              Carregar Mais Produtos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;