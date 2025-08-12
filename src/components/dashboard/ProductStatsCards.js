/**
 * Componente ProductStatsCards - CORRIGIDO
 * Cards de estatísticas para produtos no dashboard
 */

import React from 'react';
import { Package, Activity, DollarSign, TrendingUp, AlertCircle, Tag } from 'lucide-react';
import { useProductStats } from '../../hooks/useProducts';
import { StatsGridSkeleton } from '../common/LoadingSkeleton';
import { formatCurrency } from '../../utils/helpers';

// Configurações dos cards de estatística para produtos
const productStatsConfig = [
  {
    id: 'total',
    title: 'Total de Produtos',
    icon: Package,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    getValue: (stats) => stats.total,
    format: (value) => value.toString()
  },
  {
    id: 'active',
    title: 'Produtos Ativos',
    icon: Activity,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
    getValue: (stats) => stats.active,
    format: (value) => value.toString()
  },
  {
    id: 'totalValue',
    title: 'Valor Total',
    icon: DollarSign,
    bgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-600',
    getValue: (stats) => stats.totalValue,
    format: (value) => formatCurrency(value)
  },
  {
    id: 'withDiscount',
    title: 'Com Desconto',
    icon: TrendingUp,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-600',
    getValue: (stats) => stats.withDiscount || 0,
    format: (value) => `${value} produto${value !== 1 ? 's' : ''}`
  }
];

// Componente individual de card de estatística
const ProductStatCard = ({ config, value, loading = false }) => {
  const IconComponent = config.icon;
  const formattedValue = config.format(value);
  const textColor = config.textColor || 'text-gray-900';

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 animate-pulse"></div>
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${config.bgColor} rounded-lg animate-pulse`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{config.title}</p>
          <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textColor} mt-1`}>
            <span className="block truncate">{formattedValue}</span>
          </p>
        </div>
        <div className={`w-8 h-8 sm:w-12 sm:h-12 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
          <IconComponent className={`w-4 h-4 sm:w-6 sm:h-6 ${config.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Componente principal dos cards de estatísticas - CORRIGIDO
const ProductStatsCards = ({ className = '' }) => {
  const { stats, loading, hasData } = useProductStats();

  // Se não há dados e não está carregando, mostrar estado vazio
  if (!loading && !hasData) {
    return (
      <div className="col-span-full bg-white rounded-xl p-6 sm:p-8 border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum Produto Cadastrado</h3>
        <p className="text-gray-500">Adicione seu primeiro produto para ver as estatísticas aqui.</p>
      </div>
    );
  }

  // Se está carregando, mostrar skeleton
  if (loading) {
    return (
      <>
        {productStatsConfig.map((config) => (
          <ProductStatCard
            key={config.id}
            config={config}
            value={0}
            loading={true}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {productStatsConfig.map((config) => (
        <ProductStatCard
          key={config.id}
          config={config}
          value={config.getValue(stats)}
          loading={loading}
        />
      ))}
    </>
  );
};

// Componente de estatísticas por categoria
export const ProductStatsByCategory = ({ className = '' }) => {
  const { stats, loading } = useProductStats();

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats.byCategory || stats.byCategory.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center ${className}`}>
        <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Nenhum produto por categoria</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos por Categoria</h3>
      <div className="space-y-3">
        {stats.byCategory.map((categoryData, index) => (
          <div key={categoryData.categoryId || index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Tag className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {categoryData.categoryName || 'Categoria Desconhecida'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{categoryData.count}</span>
              <span className="text-xs text-gray-500">produtos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de mini estatística para produtos (sidebar)
export const MiniProductStats = ({ className = '' }) => {
  const { stats, loading } = useProductStats();

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 3 }, (_, i) => (
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

  if (!stats.total) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-500">Nenhum produto</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Total</p>
          <p className="text-lg font-bold text-blue-600">{stats.total}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Ativos</p>
          <p className="text-lg font-bold text-green-600">{stats.active}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Valor Total</p>
          <p className="text-sm font-bold text-emerald-600 truncate">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>
    </div>
  );
};

// Componente com grid próprio (para compatibilidade)
export const ProductStatsCardsWithGrid = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <ProductStatsCards />
    </div>
  );
};

export default ProductStatsCards;