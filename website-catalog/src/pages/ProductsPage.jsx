import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubcategoryFilter from '../components/SubcategoryFilter';
import { SafeProductCard } from '../components/ui/ProductErrorBoundary';
import { ProductCardSkeleton, ErrorMessage, EmptyState, LoadingSpinner } from '../components/ui/LoadingComponents';
import { useProdutos, useCategorias, useSubcategorias } from '../hooks/useApi';
import { Search, Filter, SortDesc, Grid3x3, LayoutGrid } from 'lucide-react';

const ProductsPage = ({ onProductClick, onBackToHome, initialFilters = {} }) => {
  // Estados para filtros e busca
  const [categoriaAtiva, setCategoriaAtiva] = useState(initialFilters.categoria || "Todos");
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState(initialFilters.subcategoria || "Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid"); // grid ou list
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Hooks da API
  const { 
    produtos, 
    loading: produtosLoading, 
    error: produtosError 
  } = useProdutos(categoriaAtiva, subcategoriaAtiva, 0, 24);
  
  const { 
    categorias, 
    loading: categoriasLoading 
  } = useCategorias();

  const {
    subcategorias,
    loading: subcategoriasLoading
  } = useSubcategorias();

  // ✅ CORRIGIDO: Filtrar subcategorias baseado na categoria ativa
  const subcategoriasFiltradas = subcategorias.filter(sub => {
    // Só mostra subcategorias se uma categoria específica estiver selecionada (não "Todos")
    if (categoriaAtiva === "Todos") return false;
    
    // ✅ CORREÇÃO: Verificação robusta das propriedades
    if (!sub || !sub.categoria) {
      console.warn('⚠️ Subcategoria sem categoria:', sub);
      return false;
    }

    const categoriaNome = sub.categoria.nome || sub.categoria.name || '';
    
    if (!categoriaNome) {
      console.warn('⚠️ Nome de categoria faltando na subcategoria:', sub);
      return false;
    }

    const match = categoriaNome.toLowerCase() === categoriaAtiva.toLowerCase();
    
    if (match) {
      console.log('✅ Subcategoria filtrada:', sub.nome, 'para categoria:', categoriaAtiva);
    }
    
    return match;
  });

  // Handler para mudança de categoria (limpa subcategoria)
  const handleCategoriaChange = (categoria) => {
    console.log('🗂️ Mudando categoria para:', categoria);
    setCategoriaAtiva(categoria);
    setSubcategoriaAtiva("Todas"); // Reset subcategoria quando muda categoria
  };

  // Handler para mudança de subcategoria
  const handleSubcategoriaChange = (subcategoria) => {
    console.log('🏷️ Mudando subcategoria para:', subcategoria);
    setSubcategoriaAtiva(subcategoria);
  };

  // Filtrar e ordenar produtos
  const produtosFiltrados = produtos
    .filter(produto => {
      // Filtro de busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return produto.nome.toLowerCase().includes(searchLower) ||
               produto.descricao.toLowerCase().includes(searchLower) ||
               produto.categoria.toLowerCase().includes(searchLower);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.preco.replace(/[R$,]/g, '')) - parseFloat(b.preco.replace(/[R$,]/g, ''));
        case 'price-desc':
          return parseFloat(b.preco.replace(/[R$,]/g, '')) - parseFloat(a.preco.replace(/[R$,]/g, ''));
        case 'name':
          return a.nome.localeCompare(b.nome);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Scroll to top quando mudar filtros
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoriaAtiva, subcategoriaAtiva]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header onBackToHome={onBackToHome} showBackButton={true} />

      {/* Breadcrumb */}
      <div className="bg-white/50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-amber-700">
            <button onClick={onBackToHome} className="hover:text-amber-800 transition-colors">
              Início
            </button>
            <span>/</span>
            <span className="text-amber-800 font-medium">Produtos</span>
            {categoriaAtiva !== "Todos" && (
              <>
                <span>/</span>
                <span className="text-amber-800 font-medium">{categoriaAtiva}</span>
              </>
            )}
            {subcategoriaAtiva !== "Todas" && (
              <>
                <span>/</span>
                <span className="text-amber-800 font-medium">{subcategoriaAtiva}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header da página */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-amber-800 mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-amber-700 text-lg">
            Explore nossa coleção completa de produtos de beleza e autocuidado
          </p>
        </div>

        {/* Barra de busca e controles */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all outline-none bg-white/80"
              />
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-amber-200 bg-white/80 text-amber-800 focus:border-amber-400 outline-none"
              >
                <option value="relevance">Relevância</option>
                <option value="name">Nome A-Z</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Mais Avaliados</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-amber-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-amber-800 shadow-sm' 
                      : 'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-amber-800 shadow-sm' 
                      : 'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>

              {/* Toggle Filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 transition-all"
              >
                <Filter size={18} />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar de Filtros */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} w-full lg:w-80 space-y-6`}>
            <div className="sticky top-24 space-y-4">
              {/* Filtro de Categorias */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                  📂 Categorias
                </h3>
                <div className="space-y-2">
                  {!categoriasLoading && categorias.map((categoria) => (
                    <button
                      key={categoria.nome}
                      onClick={() => handleCategoriaChange(categoria.nome)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        categoriaAtiva === categoria.nome
                          ? 'bg-amber-200 text-amber-800 font-medium shadow-sm'
                          : 'text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{categoria.nome}</span>
                        {categoria.totalProdutos > 0 && (
                          <span className="text-xs bg-amber-300 text-amber-800 px-2 py-1 rounded-full">
                            {categoria.totalProdutos}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Subcategorias - Aparece APENAS quando categoria específica é selecionada */}
              {categoriaAtiva !== "Todos" && (
                <SubcategoryFilter
                  subcategorias={subcategoriasFiltradas}
                  subcategoriaAtiva={subcategoriaAtiva}
                  onSubcategoriaChange={handleSubcategoriaChange}
                  categoriaAtiva={categoriaAtiva}
                  loading={subcategoriasLoading}
                />
              )}

              {/* Filtros Rápidos */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  ⚡ Filtros Rápidos
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCategoriaAtiva("Todos");
                      setSubcategoriaAtiva("Todas");
                      setSortBy("price-asc");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm flex items-center gap-2"
                  >
                    💰 <span>Menor Preço</span>
                  </button>
                  <button
                    onClick={() => {
                      setCategoriaAtiva("Todos");
                      setSubcategoriaAtiva("Todas");
                      setSortBy("rating");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm flex items-center gap-2"
                  >
                    ⭐ <span>Mais Avaliados</span>
                  </button>
                  <button
                    onClick={() => {
                      setCategoriaAtiva("Todos");
                      setSubcategoriaAtiva("Todas");
                      setSortBy("name");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm flex items-center gap-2"
                  >
                    🔤 <span>A-Z</span>
                  </button>
                </div>
              </div>

              {/* Limpar Filtros */}
              {(categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas" || searchTerm) && (
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
                  <button
                    onClick={() => {
                      setCategoriaAtiva("Todos");
                      setSubcategoriaAtiva("Todas");
                      setSearchTerm("");
                      setSortBy("relevance");
                    }}
                    className="w-full bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    🗑️ Limpar Todos os Filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Área de Produtos */}
          <div className="flex-1">
            {/* Contador de Resultados */}
            {!produtosLoading && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-amber-700 text-lg font-medium">
                      {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
                    </p>
                    {(categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas") && (
                      <p className="text-amber-600 text-sm">
                        {categoriaAtiva !== "Todos" && `em ${categoriaAtiva}`}
                        {subcategoriaAtiva !== "Todas" && ` → ${subcategoriaAtiva}`}
                      </p>
                    )}
                  </div>
                  
                  {/* Filtros Ativos */}
                  {(categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas" || searchTerm) && (
                    <div className="flex flex-wrap gap-2">
                      {categoriaAtiva !== "Todos" && (
                        <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          📂 {categoriaAtiva}
                          <button 
                            onClick={() => handleCategoriaChange("Todos")}
                            className="hover:bg-amber-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {subcategoriaAtiva !== "Todas" && (
                        <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          🏷️ {subcategoriaAtiva}
                          <button 
                            onClick={() => handleSubcategoriaChange("Todas")}
                            className="hover:bg-rose-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          🔍 "{searchTerm}"
                          <button 
                            onClick={() => setSearchTerm("")}
                            className="hover:bg-blue-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {produtosLoading && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(12)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Error State */}
            {produtosError && !produtosLoading && (
              <ErrorMessage 
                error={produtosError} 
                onRetry={() => window.location.reload()}
                title="Erro ao carregar produtos"
              />
            )}

            {/* Empty State */}
            {!produtosLoading && !produtosError && produtosFiltrados.length === 0 && (
              <EmptyState 
                title="Nenhum produto encontrado"
                description={
                  categoriaAtiva !== "Todos" || subcategoriaAtiva !== "Todas"
                    ? `Não há produtos disponíveis para os filtros selecionados. Tente outras opções.`
                    : "Não há produtos disponíveis no momento."
                }
                icon="📦"
              />
            )}

            {/* Products Grid */}
            {!produtosLoading && !produtosError && produtosFiltrados.length > 0 && (
              <div 
                id="produtos-grid"
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {produtosFiltrados.slice(0, 12).map((produto) => (
                  <SafeProductCard 
                    key={produto?.id || Math.random()}
                    produto={produto}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            )}

            {/* Load More Button (if needed) */}
            {!produtosLoading && !produtosError && produtosFiltrados.length > 0 && produtosFiltrados.length % 12 === 0 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-amber-200 to-rose-200 text-amber-800 px-8 py-3 rounded-full hover:from-amber-300 hover:to-rose-300 transition-all font-medium">
                  Carregar Mais Produtos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;