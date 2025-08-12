/**
 * Página de Categorias - COMPLETA COM SUBCATEGORIAS
 * Página completa de gerenciamento de categorias com tipos de imagem e subcategorias
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Tag, 
  Activity, 
  Upload,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Sidebar, { useSidebar } from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { AuthLayout } from '../components/common/ProtectedRoute';
import { CategoryListSkeleton, LoadingWithText } from '../components/common/LoadingSkeleton';
import { InlineNotification } from '../components/common/Toast';
import CategorySubcategories, { CompactCategorySubcategories } from '../components/categories/CategorySubcategories';
import { useCategories } from '../hooks/useCategories';
import { getMidDisplayUrl, getDisplayUrl } from '../utils/config';
import { IMAGE_CONTEXTS } from '../utils/constants';
import { 
  STATUS_FILTERS, 
  TOAST_TYPES, 
  CSS_CLASSES, 
  MESSAGES 
} from '../utils/constants';
import { 
  validateImageFile, 
  createImagePreview 
} from '../utils/helpers';

// Componente de filtros
const CategoryFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  onRefresh,
  loading 
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[150px]"
        >
          <option value={STATUS_FILTERS.ALL}>Todos</option>
          <option value={STATUS_FILTERS.ACTIVE}>Apenas Ativas</option>
          <option value={STATUS_FILTERS.INACTIVE}>Apenas Inativas</option>
        </select>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border border-purple-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Activity className="w-4 h-4" />
        <span className="hidden sm:inline">Atualizar</span>
      </button>
    </div>
  </div>
);

// Componente de linha da tabela - ATUALIZADO COM SUBCATEGORIAS
const CategoryTableRow = ({ category, onEdit, onDelete, expandedRows, onToggleExpand }) => {
  const categoryName = category?.nome || category?.name || 'Sem nome';
  const isActive = category?.ativo !== false;
  const isExpanded = expandedRows.includes(category.id);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="py-4 px-6 text-gray-600">#{category.id}</td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {category.imageUrl ? (
                <img 
                  src={getMidDisplayUrl(category.imageUrl)}
                  alt={categoryName}
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
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{categoryName}</span>
                <CompactCategorySubcategories category={category} maxShow={2} />
              </div>
              <div className="flex items-center gap-2 mt-1">
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
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onToggleExpand(category.id)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              title={isExpanded ? "Ocultar subcategorias" : "Mostrar subcategorias"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onEdit(category)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Editar categoria"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Excluir categoria"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      
      {/* Linha expandida com subcategorias */}
      {isExpanded && (
        <tr>
          <td colSpan="3" className="py-0 px-6">
            <div className="pb-4">
              <CategorySubcategories 
                category={category} 
                showInCard={false}
                className="bg-gray-50 border-l-4 border-purple-400"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Modal de categoria - ATUALIZADO COM TIPOS DE IMAGEM
const CategoryModal = ({ 
  isOpen, 
  onClose, 
  category = null, 
  onSave, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nome: category?.nome || category?.name || '',
    descricao: category?.descricao || category?.description || '',
    ativo: category?.ativo !== false
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const isEditing = !!category;

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          nome: category.nome || category.name || '',
          descricao: category.descricao || category.description || '',
          ativo: category.ativo !== false
        });
      } else {
        setFormData({ nome: '', descricao: '', ativo: true });
      }
      setSelectedImage(null);
      setImagePreview(null);
      setError('');
    }
  }, [isOpen, category]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedImage(file);
    try {
      const preview = await createImagePreview(file);
      setImagePreview(preview);
      setError('');
    } catch (err) {
      setError('Erro ao criar preview da imagem');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome.trim()) {
      setError(MESSAGES.CATEGORY.NAME_REQUIRED);
      return;
    }
    if (!formData.descricao.trim()) {
      setError(MESSAGES.CATEGORY.DESCRIPTION_REQUIRED);
      return;
    }
    if (!isEditing && !selectedImage) {
      setError(MESSAGES.CATEGORY.IMAGE_REQUIRED);
      return;
    }

    const categoryData = {
      ...formData,
      ...(isEditing && { id: category.id })
    };

    try {
      await onSave(categoryData, selectedImage);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar categoria');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className={CSS_CLASSES.INPUT.DEFAULT}
              placeholder="Ex: Eletrônicos, Roupas, etc."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
              className={`${CSS_CLASSES.INPUT.DEFAULT} resize-none`}
              placeholder="Descrição da categoria..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.ativo}
              onChange={(e) => setFormData({...formData, ativo: e.target.value === 'true'})}
              className={CSS_CLASSES.INPUT.DEFAULT}
              disabled={loading}
            >
              <option value="true">Ativa</option>
              <option value="false">Inativa</option>
            </select>
          </div>

          {/* Seção de Imagem - ATUALIZADA COM TIPOS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem da Categoria
            </label>
            
            {isEditing && category.imageUrl && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Imagem atual:</p>
                <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg border-2 border-gray-200">
                  <img 
                    src={getDisplayUrl(category.imageUrl)}
                    alt={formData.nome}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="flex flex-col items-center justify-center text-gray-400" style={{display: 'none'}}>
                    <Tag className="w-8 h-8 mb-1" />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {isEditing ? 'Nova imagem:' : 'Preview:'}
                    </p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    {isEditing ? 'Manter imagem atual' : 'Remover imagem'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <label className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                      {isEditing ? 'Clique para alterar imagem' : 'Clique para fazer upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG até 10MB
                      {isEditing && <br />}
                      {isEditing && <span className="text-xs">Deixe vazio para manter a imagem atual</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              disabled={loading || !formData.nome.trim() || !formData.descricao.trim() || (!isEditing && !selectedImage)}
              className={`${CSS_CLASSES.BUTTON.PRIMARY} flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {isEditing ? 'Atualizar' : 'Criar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmação de exclusão
const DeleteModal = ({ isOpen, category, onConfirm, onCancel, loading = false }) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Categoria</h3>
          <p className="text-gray-600 mb-2">
            Tem certeza que deseja excluir a categoria
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            "{category.nome || category.name}"?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={CSS_CLASSES.BUTTON.SECONDARY}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`${CSS_CLASSES.BUTTON.DANGER} flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página principal de categorias - COMPLETA COM SUBCATEGORIAS
const CategoriesPage = () => {
  const sidebar = useSidebar();
  const {
    filteredCategories,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  // Handlers
  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleSave = async (categoryData, imageFile) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(categoryData, imageFile);
      } else {
        await createCategory(categoryData, imageFile);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setSaving(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } finally {
      setSaving(false);
    }
  };

  // Handler para expandir/contrair subcategorias
  const handleToggleExpand = (categoryId) => {
    setExpandedRows(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Header */}
          <Header 
            onMenuClick={sidebar.open}
            onCreateClick={handleCreate}
          />

          {/* Content */}
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="space-y-6">
              {/* Filtros */}
              <CategoryFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={fetchCategories}
                loading={loading}
              />

              {/* Tabela de Categorias */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">ID</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Nome</th>
                        <th className="text-right py-4 px-6 font-medium text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <CategoryListSkeleton rows={5} />
                      ) : (
                        filteredCategories.map(category => (
                          <CategoryTableRow
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            expandedRows={expandedRows}
                            onToggleExpand={handleToggleExpand}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                  
                  {/* Estado vazio */}
                  {filteredCategories.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Nenhuma categoria encontrada para sua busca' : 'Nenhuma categoria cadastrada'}
                      </p>
                      <button 
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Criar Categoria
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        category={editingCategory}
        onSave={handleSave}
        loading={saving}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        category={categoryToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        loading={saving}
      />
    </AuthLayout>
  );
};

export default CategoriesPage;