import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SafeProductCard } from './ui/ProductErrorBoundary';
import { ProductCardSkeleton, EmptyState } from './ui/LoadingComponents';

const FeaturedProductsSection = ({ 
  produtos = [], 
  onProductClick, 
  onViewAllClick,
  loading = false,
  error = null 
}) => {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-serif text-amber-800 mb-8">Produtos em Destaque</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <p className="text-amber-700">Não foi possível carregar os produtos em destaque.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="destaques" className="py-16 px-4 bg-white/30">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão Ver Todos */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-4xl font-serif text-amber-800 mb-2">Produtos em Destaque</h3>
            <p className="text-amber-700 text-lg">Descubra nossos produtos mais amados</p>
          </div>
          <button 
            onClick={onViewAllClick}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 px-6 py-3 rounded-full hover:from-amber-300 hover:to-rose-300 transition-all font-medium group"
          >
            Ver Todos os Produtos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="relative">
            <div className="flex gap-6 overflow-hidden px-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex-none w-80">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && produtos.length === 0 && (
          <EmptyState 
            title="Nenhum produto em destaque"
            description="Os produtos em destaque aparecerão aqui em breve."
            icon="⭐"
          />
        )}

        {/* Products Carousel */}
        {!loading && produtos.length > 0 && (
          <div className="relative">
            {/* Navigation Arrows - só aparecem se tiver mais de 3 produtos */}
            {produtos.length > 3 && (
              <>
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
                >
                  <ChevronLeft size={24} className="text-amber-800" />
                </button>

                <button 
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
                >
                  <ChevronRight size={24} className="text-amber-800" />
                </button>
              </>
            )}

            {/* Products Container */}
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-12 pt-4" 
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {produtos.slice(0, 8).map((produto, index) => (
                <div 
                  key={produto?.id || index}
                  className="flex-none w-80 relative z-10"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Card com destaque especial */}
                  <div className="relative hover:z-20 transition-all duration-300">
                    <SafeProductCard 
                      produto={produto}
                      onProductClick={onProductClick}
                    />
                    
                    {/* Badge de destaque */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 z-30">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {index === 0 ? '🔥 TOP 1' : index === 1 ? '⭐ TOP 2' : '💎 TOP 3'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Card "Ver Mais" no final */}
              <div 
                className="flex-none w-80 relative z-10"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div 
                  onClick={onViewAllClick}
                  className="h-full bg-gradient-to-br from-amber-100 to-rose-100 rounded-2xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:from-amber-200 hover:to-rose-200 transition-all hover:scale-105 hover:z-30 min-h-[400px]"
                >
                  <div className="text-6xl mb-4">🛍️</div>
                  <h4 className="text-xl font-serif text-amber-800 mb-2 text-center">
                    Ver Todos os Produtos
                  </h4>
                  <p className="text-amber-700 text-center mb-4">
                    Explore nossa coleção completa
                  </p>
                  <div className="flex items-center gap-2 text-amber-800 font-medium">
                    Ir para Catálogo
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h4 className="text-2xl font-serif text-amber-800 mb-4">
              Não encontrou o que procura?
            </h4>
            <p className="text-amber-700 mb-6">
              Explore nossa coleção completa com mais de 100 produtos de beleza e autocuidado
            </p>
            <button 
              onClick={onViewAllClick}
              className="bg-gradient-to-r from-rose-400 to-amber-400 text-white px-8 py-3 rounded-full hover:from-rose-500 hover:to-amber-500 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explorar Catálogo Completo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;