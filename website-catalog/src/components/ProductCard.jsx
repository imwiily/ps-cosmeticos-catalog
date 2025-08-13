import React from 'react';

const ProductCard = ({ produto, onProductClick }) => {
  // Verificações de segurança para evitar erros
  if (!produto) {
    return null;
  }

  const produtoNome = produto.nome || 'Produto sem nome';
  const produtoDescricao = produto.descricao || 'Sem descrição disponível';
  const produtoCategoria = produto.categoria || 'Categoria';
  const produtoSubcategoria = produto.subcategoria || null;
  const produtoPreco = produto.preco || 'Preço não disponível';
  const produtoPrecoDesconto = produto.precoDesconto || null;

  // Nome seguro para o placeholder
  const nomeParaPlaceholder = produtoNome.split(' ')[0] || 'Produto';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 relative group">
      <div className="aspect-[4/3] flex flex-col">
        <div className="relative flex-1">
          <div className="w-full aspect-square overflow-hidden">
            {produto.imagemMedia || produto.imagem ? (
              <img 
                src={produto.imagemMedia || produto.imagem}
                alt={produtoNome}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback para placeholder colorido se a imagem falhar
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full flex items-center justify-center text-lg font-serif text-gray-600"
              style={{ 
                backgroundColor: produto.imagem ? 'transparent' : '#F0F8FF',
                display: (produto.imagemMedia || produto.imagem) ? 'none' : 'flex'
              }}
            >
              {nomeParaPlaceholder}
            </div>
          </div>
          <div className="absolute top-3 left-3 bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
            {produtoCategoria}
          </div>
          {produtoSubcategoria && produtoSubcategoria !== 'Sem subcategoria' && (
            <div className="absolute top-3 right-3 bg-rose-200 text-rose-800 px-2 py-1 rounded-full text-xs font-medium">
              {produtoSubcategoria}
            </div>
          )}
          {produtoPrecoDesconto && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              PROMOÇÃO
            </div>
          )}
        </div>
        <div className="p-3 flex-none">
          <h4 className="text-sm font-semibold text-amber-800 mb-1 line-clamp-1">{produtoNome}</h4>
          <p className="text-amber-600 text-xs mb-2 line-clamp-2">{produtoDescricao}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-rose-600">{produtoPrecoDesconto || produtoPreco}</span>
            {produtoPrecoDesconto && (
              <span className="text-xs text-gray-500 line-through">{produtoPreco}</span>
            )}
          </div>
          {/* Mostrar cores disponíveis se for produto multicolor */}
          {produto.tipo === 'MULTI_COLOR' && produto.cores && Object.keys(produto.cores).length > 0 && (
            <div className="flex gap-1 mt-2">
              {Object.entries(produto.cores).slice(0, 3).map(([nome, cor]) => (
                <div 
                  key={nome}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: cor }}
                  title={nome}
                />
              ))}
              {Object.keys(produto.cores).length > 3 && (
                <span className="text-xs text-gray-500 ml-1">+{Object.keys(produto.cores).length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-3 pt-0">
        <button 
          onClick={() => onProductClick && onProductClick(produto)}
          className="w-full bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 py-2 rounded-full hover:from-amber-300 hover:to-rose-300 transition-all font-medium text-sm group-hover:shadow-lg"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ProductCard;