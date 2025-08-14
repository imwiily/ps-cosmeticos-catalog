import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ onBackToHome, showBackButton = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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

          {/* Desktop Navigation or Back Button */}
          {showBackButton ? (
            <button 
              onClick={onBackToHome}
              className="bg-amber-200 text-amber-800 px-4 py-2 rounded-full hover:bg-amber-300 transition-colors font-medium"
            >
              ← Voltar
            </button>
          ) : (
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Início</a>
              <a href="#categorias" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Categorias</a>
              <a href="#produtos" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Produtos</a>
              <a href="#sobre" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Sobre</a>
              <a href="#contato" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Contato</a>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {!showBackButton && (
            <button 
              className="md:hidden p-2 text-amber-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !showBackButton && (
          <div className="md:hidden py-4 border-t border-amber-100">
            <nav className="flex flex-col space-y-4">
              <a href="#inicio" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Início</a>
              <a href="#categorias" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Categorias</a>
              <a href="#produtos" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Produtos</a>
              <a href="#sobre" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Sobre</a>
              <a href="#contato" className="text-amber-800 hover:text-rose-600 transition-colors font-medium">Contato</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;