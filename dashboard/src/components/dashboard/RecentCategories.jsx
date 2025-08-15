/**
 * Componente RecentCategories - ATUALIZADO
 * Lista das categorias mais recentes para o dashboard com tipos de imagem
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Plus, Eye } from 'lucide-react';
import { useCategoriesList } from '../../hooks/useCategories';
import { RecentCategoriesListSkeleton } from '../common/LoadingSkeleton';
import { getMidDisplayUrl, getIconUrl } from '../../utils/config'; // NOVO: Importar funções de imagem
import { ROUTES, CSS_CLASSES } from '../../utils/constants';

// Componente individual de categoria recente - ATUALIZADO COM TIPOS DE IMAGEM
const RecentCategoryItem = ({ category, onClick }) => {
  const categoryName = category?.nome || category?.name || 'Sem nome';
  const isActive = category?.ativo !== false;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        {/* Ícone/Imagem da categoria */}
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          {category.imageUrl ? (
            <img 
              src={getMidDisplayUrl(category.imageUrl)} // NOVO: Usando MID-DISPLAY para cards
              alt={categoryName}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Se a imagem falhar, mostrar ícone padrão
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <Tag 
            className="w-5 h-5 text-white" 
            style={{ display: category.imageUrl ? 'none' : 'block' }}
          />
        </div>
        
        {/* Informações da categoria */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{categoryName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">ID: {category.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      {onClick && (
        <button
          onClick={() => onClick(category)}
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
    <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
    <p className="text-gray-500 mb-6">Crie sua primeira categoria para começar a organizar seus produtos.</p>
    {onCreateClick && (
      <button 
        onClick={onCreateClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
      >
        <Plus className="w-4 h-4" />
        Criar primeira categoria
      </button>
    )}
  </div>
);

// Componente principal de categorias recentes
const RecentCategories = ({ 
  limit = 5, 
  showHeader = true,
  showViewAll = true,
  onCategoryClick,
  onCreateClick,
  className = ''
}) => {
  const navigate = useNavigate();
  const { categories, loading } = useCategoriesList();

  // Pegar apenas as categorias mais recentes
  const recentCategories = categories.slice(0, limit);

  // Handlers
  const handleViewAll = () => {
    navigate(ROUTES.CATEGORIES);
  };

  const handleCreateNew = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate(ROUTES.CATEGORIES);
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      // Comportamento padrão: ir para página de categorias
      navigate(ROUTES.CATEGORIES);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Categorias Recentes</h3>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Carregando...' : `${categories.length} categorias cadastradas`}
            </p>
          </div>
          
          {showViewAll && categories.length > 0 && (
            <button
              onClick={handleViewAll}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-6">
        {loading ? (
          <RecentCategoriesListSkeleton items={limit} />
        ) : recentCategories.length > 0 ? (
          <div className="space-y-4">
            {recentCategories.map(category => (
              <RecentCategoryItem
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
            
            {/* Botão para ver mais se há mais categorias */}
            {categories.length > limit && showViewAll && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-center gap-2 py-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  Ver mais {categories.length - limit} categorias
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
export const CompactRecentCategories = ({ 
  limit = 3, 
  onCategoryClick,
  className = ''
}) => {
  const { categories, loading } = useCategoriesList();
  const recentCategories = categories.slice(0, limit);

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: limit }, (_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recentCategories.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Nenhuma categoria</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {recentCategories.map(category => (
        <div
          key={category.id}
          onClick={() => onCategoryClick?.(category)}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            {category.imageUrl ? (
              <img 
                src={getIconUrl(category.imageUrl)} // NOVO: Usando ICON para sidebar
                alt={category?.nome || category?.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Tag 
              className="w-4 h-4 text-white" 
              style={{ display: category.imageUrl ? 'none' : 'block' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">
              {category?.nome || category?.name || 'Sem nome'}
            </p>
            <p className="text-xs text-gray-500">ID: {category.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hook para usar dados de categorias recentes
export const useRecentCategories = (limit = 5) => {
  const { categories, loading } = useCategoriesList();
  
  const recentCategories = categories.slice(0, limit);
  const hasMore = categories.length > limit;
  const totalCount = categories.length;

  return {
    categories: recentCategories,
    loading,
    hasMore,
    totalCount,
    isEmpty: !loading && categories.length === 0
  };
};

export default RecentCategories;