// src/hooks/useCatalogNavigation.js
import { useState, useCallback } from 'react';

export const useCatalogNavigation = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const navigateToHome = useCallback(() => {
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    window.scrollTo(0, 0);
  }, []);

  const navigateToCategories = useCallback(() => {
    setCurrentPage('categories');
    setSelectedSubcategory(null);
    window.scrollTo(0, 0);
  }, []);

  const navigateToSubcategories = useCallback((category) => {
    setCurrentPage('subcategories');
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    window.scrollTo(0, 0);
  }, []);

  const navigateToProducts = useCallback((category, subcategory = null) => {
    setCurrentPage('products');
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    window.scrollTo(0, 0);
  }, []);

  const getBreadcrumbPath = useCallback(() => {
    const path = [];
    if (selectedCategory) {
      path.push(selectedCategory.nome);
    }
    if (selectedSubcategory) {
      path.push(selectedSubcategory.nome);
    }
    return path;
  }, [selectedCategory, selectedSubcategory]);

  return {
    currentPage,
    selectedCategory,
    selectedSubcategory,
    navigateToHome,
    navigateToCategories,
    navigateToSubcategories,
    navigateToProducts,
    getBreadcrumbPath
  };
};