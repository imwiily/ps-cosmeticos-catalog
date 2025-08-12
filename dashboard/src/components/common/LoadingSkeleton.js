/**
 * Componentes de Loading Skeleton
 * Skeletons para diferentes partes da aplicação
 */

import React from 'react';

// Componente base de skeleton
const SkeletonBase = ({ className = '', children, ...props }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Skeleton de linha de texto
export const SkeletonText = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <SkeletonBase className={`${width} ${height} ${className}`} />
);

// Skeleton de círculo (para avatares, ícones)
export const SkeletonCircle = ({ size = 'w-8 h-8', className = '' }) => (
  <SkeletonBase className={`${size} rounded-full ${className}`} />
);

// Skeleton de imagem/retângulo
export const SkeletonRectangle = ({ width = 'w-full', height = 'h-32', className = '' }) => (
  <SkeletonBase className={`${width} ${height} ${className}`} />
);

// Skeleton para linha de categoria na tabela
export const CategorySkeleton = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-6">
      <SkeletonText width="w-12" />
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <SkeletonCircle size="w-8 h-8" />
        <SkeletonText width="w-32" />
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center justify-end gap-2">
        <SkeletonCircle size="w-8 h-8" />
        <SkeletonCircle size="w-8 h-8" />
      </div>
    </td>
  </tr>
);

// Skeleton para múltiplas linhas de categoria
export const CategoryListSkeleton = ({ rows = 3 }) => (
  <>
    {Array.from({ length: rows }, (_, index) => (
      <CategorySkeleton key={index} />
    ))}
  </>
);

// Skeleton para card de estatística
export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <SkeletonText width="w-24" height="h-4" />
        <SkeletonText width="w-16" height="h-8" />
      </div>
      <SkeletonRectangle width="w-12" height="h-12" className="rounded-lg" />
    </div>
  </div>
);

// Skeleton para múltiplos cards de estatística
export const StatsGridSkeleton = ({ cards = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: cards }, (_, index) => (
      <StatsCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton para card de categoria recente
export const RecentCategorySkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <SkeletonRectangle width="w-10" height="h-10" className="rounded-lg" />
      <div className="space-y-2">
        <SkeletonText width="w-32" height="h-4" />
        <SkeletonText width="w-20" height="h-3" />
      </div>
    </div>
    <SkeletonText width="w-16" height="h-6" className="rounded-full" />
  </div>
);

// Skeleton para lista de categorias recentes
export const RecentCategoriesListSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }, (_, index) => (
      <RecentCategorySkeleton key={index} />
    ))}
  </div>
);

// Skeleton para formulário de categoria
export const CategoryFormSkeleton = () => (
  <div className="space-y-4">
    <div>
      <SkeletonText width="w-32" height="h-4" className="mb-2" />
      <SkeletonRectangle width="w-full" height="h-12" className="rounded-lg" />
    </div>
    
    <div>
      <SkeletonText width="w-24" height="h-4" className="mb-2" />
      <SkeletonRectangle width="w-full" height="h-24" className="rounded-lg" />
    </div>
    
    <div>
      <SkeletonText width="w-20" height="h-4" className="mb-2" />
      <SkeletonRectangle width="w-full" height="h-12" className="rounded-lg" />
    </div>
    
    <div>
      <SkeletonText width="w-40" height="h-4" className="mb-2" />
      <SkeletonRectangle width="w-full" height="h-32" className="rounded-lg border-2 border-dashed" />
    </div>
    
    <div className="flex gap-3 pt-4">
      <SkeletonRectangle width="flex-1" height="h-12" className="rounded-lg" />
      <SkeletonRectangle width="flex-1" height="h-12" className="rounded-lg" />
    </div>
  </div>
);

// Skeleton para página completa de dashboard
export const DashboardPageSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <StatsGridSkeleton />
    
    {/* Recent Categories Section */}
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <SkeletonText width="w-40" height="h-6" />
      </div>
      <div className="p-6">
        <RecentCategoriesListSkeleton />
      </div>
    </div>
  </div>
);

// Skeleton para página de categorias
export const CategoriesPageSkeleton = () => (
  <div className="space-y-6">
    {/* Filtros */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <SkeletonRectangle width="flex-1" height="h-10" className="rounded-lg" />
        <SkeletonRectangle width="w-32" height="h-10" className="rounded-lg" />
        <SkeletonRectangle width="w-40" height="h-10" className="rounded-lg" />
      </div>
    </div>

    {/* Tabela */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6">
                <SkeletonText width="w-8" height="h-4" />
              </th>
              <th className="text-left py-4 px-6">
                <SkeletonText width="w-16" height="h-4" />
              </th>
              <th className="text-right py-4 px-6">
                <SkeletonText width="w-12" height="h-4" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <CategoryListSkeleton rows={5} />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Skeleton genérico para loading de tela cheia
export const FullPageSkeleton = ({ title = true, content = true }) => (
  <div className="min-h-screen bg-gray-50 flex">
    {/* Sidebar skeleton */}
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <SkeletonRectangle width="w-8" height="h-8" className="rounded-lg" />
          <div>
            <SkeletonText width="w-20" height="h-5" />
            <SkeletonText width="w-16" height="h-3" className="mt-1" />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonRectangle key={i} width="w-full" height="h-10" className="rounded-lg" />
        ))}
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col">
      {/* Header */}
      {title && (
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <SkeletonText width="w-48" height="h-6" />
          <SkeletonText width="w-64" height="h-4" className="mt-1" />
        </div>
      )}
      
      {/* Content */}
      {content && (
        <div className="flex-1 px-8 py-6">
          <DashboardPageSkeleton />
        </div>
      )}
    </div>
  </div>
);

// Componente de loading simples com spinner
export const LoadingSpinner = ({ size = 'w-8 h-8', className = '' }) => (
  <div className={`${size} border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin ${className}`} />
);

// Loading com texto
export const LoadingWithText = ({ text = 'Carregando...', size = 'w-6 h-6' }) => (
  <div className="flex items-center justify-center gap-3 py-8">
    <LoadingSpinner size={size} />
    <span className="text-gray-600 font-medium">{text}</span>
  </div>
);

export default {
  SkeletonText,
  SkeletonCircle,
  SkeletonRectangle,
  CategorySkeleton,
  CategoryListSkeleton,
  StatsCardSkeleton,
  StatsGridSkeleton,
  RecentCategorySkeleton,
  RecentCategoriesListSkeleton,
  CategoryFormSkeleton,
  DashboardPageSkeleton,
  CategoriesPageSkeleton,
  FullPageSkeleton,
  LoadingSpinner,
  LoadingWithText
};