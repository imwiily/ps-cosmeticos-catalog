/**
 * Web Vitals - Métricas de Performance
 * Simplificado para o Dashboard de Categorias
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Só carrega em produção para não afetar desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      }).catch(() => {
        // Se web-vitals não estiver disponível, ignorar silenciosamente
      });
    }
  }
};

export default reportWebVitals;