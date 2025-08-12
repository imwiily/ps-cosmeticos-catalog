/**
 * Componente CategorySubcategories
 * Exibe e gerencia subcategorias dentro do card de categoria
 */

import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Tag, Edit3, Trash2, X } from 'lucide-react';
import { useSubcategoriesByCategory, useSubcategories } from '../../hooks/useSubcategories';
import { InlineNotification } from '../common/Toast';
import { TOAST_TYPES, CSS_CLASSES, MESSAGES } from '../../utils/constants';

// Modal rápido para criar subcategoria
const QuickSubcategoryModal = ({ 
  isOpen, 
  onClose, 
  categoryId,
  categoryName,
  onSave, 
  loading = false 
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome da subcategoria é obrigatório');
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        categoryId: categoryId
      });
      setName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao criar subcategoria');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Nova Subcategoria</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categoria pai */}
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-700">
            <strong>Categoria:</strong> {categoryName}
          </p>
        </div>

        {error && (
          <InlineNotification
            message={error}
            type={TOAST_TYPES.ERROR}
            showIcon={true}
            showClose={true}
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Subcategoria
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={CSS_CLASSES.INPUT.DEFAULT}
              placeholder="Ex: Eletrônicos Portáteis..."
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={CSS_CLASSES.BUTTON.SECONDARY}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={`${CSS_CLASSES.BUTTON.PRIMARY} flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Criar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente individual de subcategoria
const SubcategoryItem = ({ subcategory, onEdit, onDelete, compact = true }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
          <Tag className="w-2 h-2 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 truncate">
          {subcategory.name || subcategory.nome}
        </span>
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onEdit && onEdit(subcategory)}
          className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
          title="Editar subcategoria"
        >
          <Edit3 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete && onDelete(subcategory)}
          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
          title="Excluir subcategoria"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Componente principal
const CategorySubcategories = ({ 
  category, 
  showInCard = true,
  maxVisible = 3,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { subcategories, loading, refresh } = useSubcategoriesByCategory(category.id);
  const { createSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasSubcategories = subcategories.length > 0;
  const visibleSubcategories = isExpanded ? subcategories : subcategories.slice(0, maxVisible);
  const hasMore = subcategories.length > maxVisible;

  // Handlers
  const handleCreate = async (subcategoryData) => {
    setSaving(true);
    try {
      await createSubcategory(subcategoryData);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subcategory) => {
    if (onEdit) {
      onEdit(subcategory);
    }
  };

  const handleDelete = async (subcategory) => {
    if (onDelete) {
      onDelete(subcategory);
    } else {
      // Confirmar e excluir
      if (window.confirm(`Tem certeza que deseja excluir a subcategoria "${subcategory.name || subcategory.nome}"?`)) {
        setSaving(true);
        try {
          await deleteSubcategory(subcategory.id);
          await refresh();
        } finally {
          setSaving(false);
        }
      }
    }
  };

  if (showInCard) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Header com contagem e botão criar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={!hasSubcategories}
            >
              {hasSubcategories && (
                isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )
              )}
              <span>Subcategorias ({subcategories.length})</span>
            </button>
            
            {loading && (
              <div className="w-3 h-3 border border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
            )}
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
            title="Criar subcategoria"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Nova</span>
          </button>
        </div>

        {/* Lista de subcategorias */}
        {hasSubcategories && (isExpanded || !hasMore) && (
          <div className="space-y-2">
            {visibleSubcategories.map(subcategory => (
              <SubcategoryItem
                key={subcategory.id}
                subcategory={subcategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact={true}
              />
            ))}
            
            {/* Botão "Ver mais" */}
            {!isExpanded && hasMore && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full py-2 text-xs text-purple-600 hover:text-purple-700 font-medium text-center border border-dashed border-purple-300 rounded hover:border-purple-400 transition-colors"
              >
                Ver mais {subcategories.length - maxVisible} subcategorias
              </button>
            )}
          </div>
        )}

        {/* Estado vazio */}
        {!hasSubcategories && !loading && (
          <div className="text-center py-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Tag className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500 mb-2">Nenhuma subcategoria</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Criar primeira subcategoria
            </button>
          </div>
        )}

        {/* Modal de criação */}
        <QuickSubcategoryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          categoryId={category.id}
          categoryName={category.nome || category.name}
          onSave={handleCreate}
          loading={saving}
        />
      </div>
    );
  }

  // Versão para fora do card (modo completo)
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600" />
          Subcategorias de "{category.nome || category.name}"
        </h4>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`${CSS_CLASSES.BUTTON.PRIMARY} text-sm px-3 py-1`}
        >
          <Plus className="w-3 h-3 mr-1" />
          Nova Subcategoria
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : hasSubcategories ? (
        <div className="space-y-2">
          {subcategories.map(subcategory => (
            <SubcategoryItem
              key={subcategory.id}
              subcategory={subcategory}
              onEdit={handleEdit}
              onDelete={handleDelete}
              compact={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-3">
            Esta categoria não possui subcategorias
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className={CSS_CLASSES.BUTTON.PRIMARY}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Subcategoria
          </button>
        </div>
      )}

      {/* Modal de criação */}
      <QuickSubcategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categoryId={category.id}
        categoryName={category.nome || category.name}
        onSave={handleCreate}
        loading={saving}
      />
    </div>
  );
};

// Componente compacto para usar em listas
export const CompactCategorySubcategories = ({ category, maxShow = 2 }) => {
  const { subcategories, loading } = useSubcategoriesByCategory(category.id);
  
  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-500">Carregando...</span>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <span className="text-xs text-gray-400">Sem subcategorias</span>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {subcategories.slice(0, maxShow).map(subcategory => (
        <span
          key={subcategory.id}
          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
        >
          <Tag className="w-2 h-2" />
          {subcategory.name || subcategory.nome}
        </span>
      ))}
      {subcategories.length > maxShow && (
        <span className="text-xs text-gray-500">
          +{subcategories.length - maxShow}
        </span>
      )}
    </div>
  );
};

export default CategorySubcategories;