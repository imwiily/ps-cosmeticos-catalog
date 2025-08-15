/**
 * Componente RecentProducts - ATUALIZADO
 * Lista dos produtos mais recentes para o dashboard com tipos de imagem
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Plus, Eye, Tag, DollarSign } from 'lucide-react';
import { useRecentProducts } from '../../hooks/useProducts';
import { RecentCategoriesListSkeleton } from '../common/LoadingSkeleton';
import { getMidDisplayUrl, getIconUrl } from '../../utils/config'; // NOVO: Importar funções de imagem
import { ROUTES, CSS_CLASSES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

// Componente individual de produto recente - ATUALIZADO COM TIPOS DE IMAGEM
const RecentProductItem = ({ product, onClick, getCategoryById }) => {
  const productName = product?.nome || product?.name || 'Sem nome';
  const isActive = product?.ativo !== false && product?.active !== false;
  const price = product?.preco || product?.price || 0;
  const discountPrice = product?.precoDesconto || product?.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const category = getCategoryById ? getCategoryById(product?.categoriaId) : null;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {/* Imagem do produto */}
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          {product.imageUrl || product.imageURL ? (
            <img 
              src={getMidDisplayUrl(product.imageUrl || product.imageURL)} // NOVO: Usando MID-DISPLAY para cards
              alt={productName}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <Package 
            className="w-5 h-5 text-white" 
            style={{ display: (product.imageUrl || product.imageURL) ? 'none' : 'block' }}
          />
        </div>
        
        {/* Informações do produto */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{productName}</h4>
          <div className="flex items-center gap-2 mt-1">
            {hasDiscount ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(discountPrice)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(price)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(price)}
              </span>
            )}
            {category && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">{category.nome || category.name}</span>
              </>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      {onClick && (
        <button
          onClick={() => onClick(product)}
          className="ml-3 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex-shrink-0"
          title="Ver detalhes"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Componente de estado vazio
const EmptyState = ({ onCreateClick }) => (
  <div className="text-center py-12">
    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
    <p className="text-gray-500 mb-6">Crie seu primeiro produto para começar a vender.</p>
    {onCreateClick && (
      <button 
        onClick={onCreateClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
      >
        <Plus className="w-4 h-4" />
        Criar primeiro produto
      </button>
    )}
  </div>
);

// Componente principal de produtos recentes
const RecentProducts = ({ 
  limit = 5, 
  showHeader = true,
  showViewAll = true,
  onProductClick,
  onCreateClick,
  getCategoryById,
  className = ''
}) => {
  const navigate = useNavigate();
  const { products, loading } = useRecentProducts(limit);

  // Handlers
  const handleViewAll = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const handleCreateNew = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate(ROUTES.PRODUCTS);
    }
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Comportamento padrão: ir para página de produtos
      navigate(ROUTES.PRODUCTS);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Produtos Recentes</h3>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Carregando...' : `${products.length} produtos mais recentes`}
            </p>
          </div>
          
          {showViewAll && products.length > 0 && (
            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-6">
        {loading ? (
          <RecentCategoriesListSkeleton items={limit} />
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {products.map(product => (
              <RecentProductItem
                key={product.id}
                product={product}
                onClick={handleProductClick}
                getCategoryById={getCategoryById}
              />
            ))}
            
            {/* Botão para ver mais se há mais produtos */}
            {showViewAll && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-center gap-2 py-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  Ver todos os produtos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState onCreateClick={handleCreateNew} />
        )}
      </div>
    </div>
  );
};

// Componente compacto para sidebar ou outras áreas - ATUALIZADO COM TIPOS DE IMAGEM
export const CompactRecentProducts = ({ 
  limit = 3, 
  onProductClick,
  getCategoryById,
  className = ''
}) => {
  const { products, loading } = useRecentProducts(limit);

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: limit }, (_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Nenhum produto</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {products.map(product => {
        const price = product?.preco || product?.price || 0;
        const category = getCategoryById ? getCategoryById(product?.categoriaId) : null;
        
        return (
          <div
            key={product.id}
            onClick={() => onProductClick?.(product)}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {product.imageUrl ? (
                <img 
                  src={getIconUrl(product.imageUrl)} // NOVO: Usando ICON para sidebar
                  alt={product?.nome || product?.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <Package 
                className="w-4 h-4 text-white" 
                style={{ display: product.imageUrl ? 'none' : 'block' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {product?.nome || product?.name || 'Sem nome'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-green-600">
                  {formatCurrency(price)}
                </p>
                {category && (
                  <>
                    <span className="text-gray-300">•</span>
                    <p className="text-xs text-gray-500 truncate">
                      {category.nome || category.name}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente de produtos por categoria - ATUALIZADO COM TIPOS DE IMAGEM
export const ProductsByCategory = ({ 
  categoryId, 
  categoryName,
  limit = 3,
  onProductClick,
  className = ''
}) => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      try {
        const { productService } = await import('../../services/api');
        const { useAuth } = await import('../../contexts/AuthContext');
        
        // Simulação - em uma implementação real você teria acesso ao token
        // const { getToken } = useAuth();
        // const token = getToken();
        // const data = await productService.fetchProductsByCategory(categoryId, token);
        
        // Por enquanto, array vazio
        const data = [];
        
        setProducts(data.slice(0, limit));
      } catch (error) {
        console.error('Erro ao carregar produtos da categoria:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, limit]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4 text-purple-600" />
        {categoryName}
      </h4>
      
      {products.length > 0 ? (
        <div className="space-y-2">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => onProductClick?.(product)}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={getIconUrl(product.imageUrl)} // NOVO: Usando ICON para mini-cards
                      alt={product.nome || product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Package className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 truncate">
                  {product.nome || product.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-green-600 ml-2">
                {formatCurrency(product.preco || product.price || 0)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-xs text-gray-500">Nenhum produto nesta categoria</p>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;