import React from 'react';

const HeroSection = () => {
  return (
    <section id="inicio" className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-serif text-amber-800 mb-6">
          Sejam bem-vindas ✨
        </h2>
        <p className="text-xl text-amber-700 mb-8 max-w-4xl mx-auto leading-relaxed">
          Aqui você encontrará produtos de <span className="font-semibold">skincare</span>, <span className="font-semibold">haircare</span>, <span className="font-semibold">maquiagem</span> e <span className="font-semibold">autocuidado</span>, para valorizar sua beleza natural e elevar sua autoestima.
        </p>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
          <p className="text-amber-800 text-lg italic">
            "Autocuidado não é vaidade, é amor-próprio em cada detalhe, e na PS Cosméticos esse cuidado começa por você!"
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;