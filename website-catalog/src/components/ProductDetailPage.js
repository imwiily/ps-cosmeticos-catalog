import React from 'react';
import Header from './Header';
import { renderStars } from '../utils/helpers';
import { useProdutosRelacionados } from '../hooks/useApi';
import { LoadingSpinner, ErrorMessage, ProductCardSkeleton } from './ui/LoadingComponents';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetailPage = ({ product, onBackToHome, onBackToProducts, onProductClick }) => {
  const { 
    produtosRelacionados, 
    loading: loadingRelacionados, 
    error: errorRelacionados 
  } = useProdutosRelacionados(product?.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center">
        <ErrorMessage 
          title="Produto não encontrado"
          error="O produto que você está procurando não foi encontrado."
          onRetry={onBackToHome}
        />
      </div>
    );
  }

  // Header customizado com breadcrumb
  const CustomHeader = () => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={onBackToHome}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif text-amber-800">PS</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif text-amber-800">PS Cosméticos</h1>
                <p className="text-xs text-amber-600">Beleza & Autocuidado</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToProducts}
              className="flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full hover:bg-amber-200 transition-colors font-medium"
            >
              <ShoppingBag size={16} />
              Catálogo
            </button>
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 bg-amber-200 text-amber-800 px-4 py-2 rounded-full hover:bg-amber-300 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Início
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="pb-4">
          <nav className="flex items-center gap-2 text-sm text-amber-700">
            <button onClick={onBackToHome} className="hover:text-amber-800 transition-colors">
              Início
            </button>
            <span>/</span>
            <button onClick={onBackToProducts} className="hover:text-amber-800 transition-colors">
              Produtos
            </button>
            <span>/</span>
            <span className="text-amber-800 font-medium">{product.categoria}</span>
            {product.subcategoria && product.subcategoria !== 'Sem subcategoria' && (
              <>
                <span>/</span>
                <span className="text-amber-800 font-medium">{product.subcategoria}</span>
              </>
            )}
            <span>/</span>
            <span className="text-amber-800 font-medium truncate max-w-xs">{product.nome}</span>
          </nav>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <CustomHeader />

      {/* Product Detail Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="w-full aspect-square rounded-2xl shadow-lg overflow-hidden">
              {product.imagem ? (
                <img 
                  src={product.imagem}
                  alt={product.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para placeholder se a imagem falhar
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full flex items-center justify-center text-4xl font-serif text-gray-600"
                style={{ 
                  backgroundColor: product.imagem ? 'transparent' : '#F0F8FF',
                  display: product.imagem ? 'none' : 'flex'
                }}
              >
                {product.nome.split(' ')[0]}
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.categoria}
            </div>
            {product.subcategoria && product.subcategoria !== 'Sem subcategoria' && (
              <div className="absolute top-4 right-4 bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.subcategoria}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif text-amber-800 mb-2">{product.nome}</h1>
              <p className="text-xl text-amber-600">{product.descricao}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              {renderStars(product.rating)}
              <span className="text-amber-600">({product.avaliacoes} avaliações)</span>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Colors (se for produto multicolor) */}
            {product.tipo === 'MULTI_COLOR' && product.cores && Object.keys(product.cores).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-amber-800">Cores Disponíveis:</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(product.cores).map(([nome, cor]) => (
                    <div key={nome} className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-full">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: cor }}
                      />
                      <span className="text-sm text-amber-800">{nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              {product.precoDesconto ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-rose-600">{product.precoDesconto}</span>
                  <span className="text-xl text-gray-500 line-through">{product.preco}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">PROMOÇÃO</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-rose-600">{product.preco}</span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 py-4 rounded-full text-lg font-semibold hover:from-amber-300 hover:to-rose-300 transition-all">
                Entrar em Contato
              </button>
              <button className="w-full border-2 border-amber-200 text-amber-800 py-3 rounded-full font-medium hover:bg-amber-50 transition-all">
                Adicionar aos Favoritos ♡
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl p-8">
          <div className="space-y-8">
            {/* Description */}
            {product.descricaoCompleta && (
              <div>
                <h3 className="text-2xl font-serif text-amber-800 mb-4">Descrição Completa</h3>
                <p className="text-amber-700 leading-relaxed">{product.descricaoCompleta}</p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredientes && product.ingredientes.length > 0 && (
              <div>
                <h3 className="text-2xl font-serif text-amber-800 mb-4">Ingredientes Principais</h3>
                <div className="flex flex-wrap gap-3">
                  {product.ingredientes.map((ingrediente, index) => (
                    <span key={index} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                      {ingrediente}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use */}
            {product.modoUso && (
              <div>
                <h3 className="text-2xl font-serif text-amber-800 mb-4">Como Usar</h3>
                <p className="text-amber-700 leading-relaxed">{product.modoUso}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-serif text-amber-800">Produtos Relacionados</h3>
            <button 
              onClick={onBackToProducts}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
            >
              Ver mais produtos
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>
          
          {loadingRelacionados && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {errorRelacionados && (
            <div className="text-center py-8">
              <p className="text-amber-600">Não foi possível carregar produtos relacionados.</p>
            </div>
          )}

          {!loadingRelacionados && !errorRelacionados && produtosRelacionados.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtosRelacionados.slice(0, 3).map((produto) => (
                <div 
                  key={produto.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={() => onProductClick(produto)}
                >
                  <div className="w-full aspect-square overflow-hidden">
                    {produto.imagem ? (
                      <img 
                        src={produto.imagemMedia || produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center text-xl font-serif text-gray-600"
                      style={{ 
                        backgroundColor: produto.imagem ? 'transparent' : '#F0F8FF',
                        display: produto.imagem ? 'none' : 'flex'
                      }}
                    >
                      {produto.nome.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-amber-800 mb-2">{produto.nome}</h4>
                    <p className="text-amber-600 text-sm mb-2">{produto.descricao}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-rose-600">{produto.precoDesconto || produto.preco}</span>
                      {renderStars(produto.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingRelacionados && !errorRelacionados && produtosRelacionados.length === 0 && (
            <div className="text-center py-8">
              <p className="text-amber-600">Nenhum produto relacionado encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;