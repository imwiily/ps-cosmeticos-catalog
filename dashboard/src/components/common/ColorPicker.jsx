/**
 * Componente ColorPicker
 * Seletor de cores com cores predefinidas e entrada customizada
 */

import React, { useState } from 'react';
import { Plus, X, Palette, Check } from 'lucide-react';
import { 
  PREDEFINED_COLORS, 
  UI_CONFIG, 
  CSS_CLASSES,
  MESSAGES 
} from '../../utils/constants';
import {
  validateColor,
  normalizeHexColor,
  getContrastTextColor,
  formatColorsForDisplay
} from '../../utils/helpers';

// Componente individual de cor
const ColorItem = ({ 
  name, 
  hex, 
  onRemove, 
  isRemovable = true,
  className = '' 
}) => {
  const textColor = getContrastTextColor(hex);
  const textClass = textColor === 'light' ? 'text-white' : 'text-black';
  
  return (
    <div className={`flex items-center gap-2 p-2 bg-gray-50 rounded-lg ${className}`}>
      <div 
        className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"
        style={{ backgroundColor: hex }}
        title={`${name} - ${hex}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{name}</p>
        <p className="text-xs text-gray-500">{hex}</p>
      </div>
      {isRemovable && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(name)}
          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
          title="Remover cor"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Seletor de cores predefinidas
const PredefinedColorGrid = ({ onSelectColor, selectedColors = {} }) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {Object.entries(PREDEFINED_COLORS).map(([name, hex]) => {
        const isSelected = selectedColors[name];
        
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelectColor(name, hex)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${isSelected 
                ? 'border-purple-500 ring-2 ring-purple-200' 
                : 'border-gray-300 hover:border-gray-500'
              }
            `}
            style={{ backgroundColor: hex }}
            title={`${name} - ${hex}`}
            disabled={isSelected}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-white mx-auto" style={{
                filter: getContrastTextColor(hex) === 'light' ? 'none' : 'invert(1)'
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
};

// Formulário para cor customizada
const CustomColorForm = ({ onAddColor, selectedColors = {} }) => {
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState(UI_CONFIG.DEFAULT_COLOR);
  const [errors, setErrors] = useState([]);
  
  // CORRIGIDO: Função handleSubmit com prevenção de propagação
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // NOVO: Impede propagação para o formulário pai
    }
    
    setErrors([]);
    
    const validation = validateColor(colorName, colorHex, selectedColors);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    onAddColor(colorName.trim(), normalizeHexColor(colorHex));
    setColorName('');
    setColorHex(UI_CONFIG.DEFAULT_COLOR);
  };
  
  // CORRIGIDO: Função para Enter key que não propaga evento
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // NOVO: Impede propagação
      handleSubmit(e);
    }
  };
  
  const canAdd = colorName.trim() && colorHex && Object.keys(selectedColors).length < UI_CONFIG.MAX_COLORS_PER_PRODUCT;
  
  return (
    // CORRIGIDO: Remover onSubmit do form para evitar conflitos
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Cor
          </label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            onKeyPress={handleKeyPress} // CORRIGIDO: Usar função que previne propagação
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="Ex: Azul Royal"
            maxLength={30}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código da Cor
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className={CSS_CLASSES.INPUT.COLOR}
              title="Selecionar cor"
            />
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              onKeyPress={handleKeyPress} // CORRIGIDO: Usar função que previne propagação
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
              placeholder="#FF0000"
              maxLength={7}
            />
          </div>
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="text-sm text-red-600 space-y-1">
          {errors.map((error, index) => (
            <p key={index}>• {error}</p>
          ))}
        </div>
      )}
      
      {/* CORRIGIDO: type="button" e onClick direto em vez de submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canAdd}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${canAdd
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <Plus className="w-4 h-4" />
        Adicionar Cor
      </button>
      
      {Object.keys(selectedColors).length >= UI_CONFIG.MAX_COLORS_PER_PRODUCT && (
        <p className="text-sm text-amber-600 text-center">
          Máximo de {UI_CONFIG.MAX_COLORS_PER_PRODUCT} cores por produto
        </p>
      )}
    </div>
  );
};

// Componente principal ColorPicker
const ColorPicker = ({ 
  colors = {}, 
  onChange, 
  disabled = false,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('predefined');
  const selectedColors = colors || {};
  
  const handleSelectPredefinedColor = (name, hex) => {
    if (selectedColors[name]) return; // Já selecionada
    
    const newColors = { ...selectedColors, [name]: hex };
    onChange(newColors);
  };
  
  const handleAddCustomColor = (name, hex) => {
    const newColors = { ...selectedColors, [name]: hex };
    onChange(newColors);
  };
  
  const handleRemoveColor = (name) => {
    const newColors = { ...selectedColors };
    delete newColors[name];
    onChange(newColors);
  };
  
  const colorCount = Object.keys(selectedColors).length;
  const formattedColors = formatColorsForDisplay(selectedColors);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header com contagem */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Cores do Produto ({colorCount})
        </h4>
        {colorCount > 0 && (
          <div className="flex items-center gap-1">
            {Object.values(selectedColors).slice(0, 3).map((hex, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: hex }}
              />
            ))}
            {colorCount > 3 && (
              <span className="text-xs text-gray-500 ml-1">+{colorCount - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('predefined')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'predefined'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Cores Predefinidas
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'custom'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Cor Personalizada
            </div>
          </button>
        </nav>
      </div>
      
      {/* Conteúdo das tabs */}
      <div className="mt-4">
        {activeTab === 'predefined' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clique nas cores para adicionar ao seu produto:
            </p>
            <PredefinedColorGrid
              onSelectColor={handleSelectPredefinedColor}
              selectedColors={selectedColors}
            />
          </div>
        )}
        
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Crie uma cor personalizada para seu produto:
            </p>
            <CustomColorForm
              onAddColor={handleAddCustomColor}
              selectedColors={selectedColors}
            />
          </div>
        )}
      </div>
      
      {/* Lista de cores selecionadas */}
      {colorCount > 0 && (
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-gray-700">
            Cores Selecionadas:
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {formattedColors.map((color) => (
              <ColorItem
                key={color.name}
                name={color.name}
                hex={color.hex}
                onRemove={handleRemoveColor}
                isRemovable={!disabled}
              />
            ))}
          </div>
          
          {/* Preview do gradiente */}
          {colorCount > 1 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Preview do gradiente:</p>
              <div 
                className="h-8 rounded-lg border border-gray-300"
                style={{
                  background: `linear-gradient(45deg, ${Object.values(selectedColors).join(', ')})`
                }}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Estado vazio */}
      {colorCount === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Palette className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500 mb-2">
            Nenhuma cor selecionada
          </p>
          <p className="text-xs text-gray-400">
            Adicione cores usando as abas acima
          </p>
        </div>
      )}
    </div>
  );
};

// Componente simplificado para visualização apenas
export const ColorDisplay = ({ colors, size = 'sm', showNames = true }) => {
  const formattedColors = formatColorsForDisplay(colors);
  
  if (formattedColors.length === 0) {
    return (
      <span className="text-xs text-gray-500">Sem cores</span>
    );
  }
  
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {formattedColors.map((color) => (
        <div key={color.name} className="flex items-center gap-1">
          <div
            className={`${sizeClasses[size]} rounded-full border border-gray-300 flex-shrink-0`}
            style={{ backgroundColor: color.hex }}
            title={`${color.name} - ${color.hex}`}
          />
          {showNames && (
            <span className="text-xs text-gray-600">{color.name}</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Componente para badge de múltiplas cores
export const MultiColorBadge = ({ colors, maxShow = 3 }) => {
  const colorValues = Object.values(colors || {});
  const colorCount = colorValues.length;
  
  if (colorCount === 0) return null;
  
  if (colorCount === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
        <div 
          className="w-3 h-3 rounded-full border border-purple-300"
          style={{ backgroundColor: colorValues[0] }}
        />
        1 cor
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
      <div className="flex -space-x-1">
        {colorValues.slice(0, maxShow).map((hex, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full border border-white"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
      {colorCount} cores
    </span>
  );
};

export default ColorPicker;