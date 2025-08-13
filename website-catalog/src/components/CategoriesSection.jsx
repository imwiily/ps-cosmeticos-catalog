import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryCardSkeleton } from './ui/LoadingComponents';

const CategoriesSection = ({ categorias = [], onCategoryClick }) => {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320; // largura do card + gap
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

  // Se não há categorias carregadas, mostrar skeletons
  if (!categorias.length) {
    return (
      <section id="categorias" className="py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-serif text-amber-800 text-center mb-12">Nossas Categorias</h3>
          <div className="flex gap-6 overflow-hidden px-12">
            {[...Array(4)].map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-serif text-amber-800 text-center mb-12">Nossas Categorias</h3>
        
        {/* Carrossel de Categorias */}
        <div className="relative">
          {/* Seta Esquerda */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronLeft size={24} className="text-amber-800" />
          </button>

          {/* Seta Direita */}
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronRight size={24} className="text-amber-800" />
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-12" 
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categorias.map((categoria) => (
              <div 
                key={categoria.id}
                className="flex-none w-80 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer group"
                onClick={() => onCategoryClick(categoria.nome)}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="w-full h-60 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                  {categoria.imagem ? (
                    <img 
                      src={categoria.imagem} 
                      alt={categoria.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para cor se a imagem falhar
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl font-serif text-gray-600"
                    style={{ 
                      backgroundColor: categoria.imagem ? 'transparent' : getDefaultColor(categoria.nome),
                      display: categoria.imagem ? 'none' : 'flex'
                    }}
                  >
                    {categoria.nome.substring(0, 2)}
                  </div>
                  {categoria.totalProdutos > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      {categoria.totalProdutos} produtos
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-serif text-amber-800 mb-3">{categoria.nome}</h4>
                  <p className="text-amber-700 mb-4 leading-relaxed text-sm">
                    {categoria.descricao || getDefaultDescription(categoria.nome)}
                  </p>
                  <button className="w-full bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 py-3 rounded-full hover:from-amber-300 hover:to-rose-300 transition-all font-medium">
                    {categoria.nome === 'Todos' ? 'Ver Todos' : 'Ver Produtos'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Função para obter cor padrão baseada no nome da categoria
const getDefaultColor = (nome) => {
  const colors = {
    'Todos': '#F0FFE6',
    'Skincare': '#FFE4E1',
    'Haircare': '#E6F3FF',
    'Maquiagem': '#FFF0E6',
    'Categoria': '#F5E6FF'
  };
  return colors[nome] || '#F0F8FF';
};

// Função para obter descrição padrão baseada no nome da categoria
const getDefaultDescription = (nome) => {
  const descriptions = {
    'Todos': 'Uma rotina completa de beleza e bem-estar. Descubra todos os nossos produtos para se cuidar.',
    'Skincare': 'Produtos para cuidar da sua pele com carinho e delicadeza. Séruns, cremes hidratantes e tratamentos anti-idade.',
    'Haircare': 'Tudo para cuidar dos seus cabelos. Shampoos, condicionadores, máscaras e tratamentos reconstrutores.',
    'Maquiagem': 'Realce sua beleza natural. Bases, paletas de sombras, batons e produtos para uma maquiagem perfeita.'
  };
  return descriptions[nome] || 'Produtos de alta qualidade para realçar sua beleza natural.';
};

export default CategoriesSection;