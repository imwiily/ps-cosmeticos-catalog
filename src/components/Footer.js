import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-amber-800 text-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-rose-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-serif text-amber-800">PS</span>
          </div>
          <span className="text-xl font-serif">PS Cosméticos</span>
        </div>
        <p className="mb-4">Autocuidado não é vaidade, é amor-próprio ✨</p>
        <p className="text-amber-300 text-sm">© 2025 PS Cosméticos. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;