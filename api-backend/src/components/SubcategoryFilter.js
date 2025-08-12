import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const SubcategoryFilter = ({ 
  subcategorias = [], 
  subcategoriaAtiva, 
  onSubcategoriaChange,
  categoriaAtiva = "Todos",
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-rose-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Se não há subcategorias para a categoria selecionada
  if (subcategorias.length === 0 && categoriaAtiva !== "Todos") {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="text-center py-4">
          <div className="text-gray-400 text-2xl mb-2">📋</div>
          <h3 className="font-medium text-gray-600 mb-1">Sem Subcategorias</h3>
          <p className="text-xs text-gray-500">
            A categoria "{categoriaAtiva}" não possui subcategorias
          </p>
        </div>
      </div>
    );
  }

  // Se categoria "Todos" está selecionada, não mostra nada
  if (categoriaAtiva === "Todos" || subcategorias.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-rose-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-rose-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-rose-600" />
          <div className="text-left">
            <h3 className="font-semibold text-rose-800">Subcategorias</h3>
            {categoriaAtiva !== "Todos" && (
              <p className="text-xs text-rose-600">de {categoriaAtiva}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
            {subcategorias.length}
          </span>
          {isExpanded ? (
            <ChevronUp size={16} className="text-rose-600" />
          ) : (
            <ChevronDown size={16} className="text-rose-600" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-1">
            {/* Opção "Todas" */}
            <button
              onClick={() => onSubcategoriaChange("Todas")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                subcategoriaAtiva === "Todas"
                  ? 'bg-rose-200 text-rose-800 font-medium shadow-sm'
                  : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>📋 Todas as Subcategorias</span>
                {subcategoriaAtiva === "Todas" && (
                  <span className="text-rose-600 font-bold">●</span>
                )}
              </div>
            </button>

            {/* Lista de Subcategorias */}
            {subcategorias.map((subcategoria, index) => (
              <button
                key={subcategoria.id}
                onClick={() => onSubcategoriaChange(subcategoria.nome)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  subcategoriaAtiva === subcategoria.nome
                    ? 'bg-rose-200 text-rose-800 font-medium shadow-sm'
                    : 'text-rose-700 hover:bg-rose-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {getSubcategoryIcon(index)} {subcategoria.nome}
                  </span>
                  {subcategoriaAtiva === subcategoria.nome && (
                    <span className="text-rose-600 font-bold">●</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-rose-200">
            <div className="flex gap-2">
              <button
                onClick={() => onSubcategoriaChange("Todas")}
                className="flex-1 text-xs bg-rose-100 text-rose-700 py-2 rounded-md hover:bg-rose-200 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => {
                  // Scroll para produtos
                  document.getElementById('produtos-grid')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="flex-1 text-xs bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors"
              >
                Ver Produtos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Função para obter ícones para subcategorias
const getSubcategoryIcon = (index) => {
  const icons = ['🏷️', '✨', '💎', '🌟', '🎀', '💄', '🧴', '🧼', '🌸', '💐'];
  return icons[index % icons.length];
};

export default SubcategoryFilter;