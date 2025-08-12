import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SubcategoriesSection = ({ 
  subcategorias = [], 
  categoriaAtiva, 
  subcategoriaAtiva,
  onSubcategoryClick,
  loading = false 
}) => {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 200;
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

  // Se não há subcategorias ou está carregando, não mostra a seção
  if (loading || subcategorias.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-2xl font-serif text-amber-800 text-center mb-8">
          Subcategorias {categoriaAtiva !== "Todos" && `de ${categoriaAtiva}`}
        </h4>
        
        <div className="relative">
          {/* Setas de navegação - apenas se houver overflow */}
          {subcategorias.length > 4 && (
            <>
              <button 
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110"
              >
                <ChevronLeft size={20} className="text-amber-800" />
              </button>

              <button 
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all hover:scale-110"
              >
                <ChevronRight size={20} className="text-amber-800" />
              </button>
            </>
          )}

          {/* Container das subcategorias */}
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-8" 
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {/* Botão "Todas" */}
            <div 
              className="flex-none"
              style={{ scrollSnapAlign: 'start' }}
            >
              <button
                onClick={() => onSubcategoryClick("Todas")}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  subcategoriaAtiva === "Todas"
                    ? 'bg-rose-200 text-rose-800 shadow-md'
                    : 'bg-white/70 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Todas as Subcategorias
              </button>
            </div>

            {/* Subcategorias */}
            {subcategorias.map((subcategoria) => (
              <div 
                key={subcategoria.id}
                className="flex-none"
                style={{ scrollSnapAlign: 'start' }}
              >
                <button
                  onClick={() => onSubcategoryClick(subcategoria.nome)}
                  className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                    subcategoriaAtiva === subcategoria.nome
                      ? 'bg-rose-200 text-rose-800 shadow-md'
                      : 'bg-white/70 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {subcategoria.nome}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubcategoriesSection;