import React from 'react';

const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-serif text-amber-800 mb-6">Sobre a PS Cosméticos</h3>
            <p className="text-amber-700 text-lg mb-6 leading-relaxed">
              Na PS Cosméticos, acreditamos que cada pessoa merece se sentir bela e confiante. Nossa missão é oferecer produtos de alta qualidade que realçam sua beleza natural e promovem o autocuidado como uma forma de amor-próprio.
            </p>
            <p className="text-amber-700 text-lg mb-6 leading-relaxed">
              Cuidadosamente selecionamos cada produto em nosso catálogo, priorizando ingredientes naturais, qualidade excepcional e resultados comprovados. Porque você merece o melhor.
            </p>
          </div>
          <div className="relative">
            <div 
              className="w-full h-96 rounded-2xl shadow-lg flex items-center justify-center text-4xl font-serif text-gray-600"
              style={{ backgroundColor: "#F0F8FF" }}
            >
              Produtos PS
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;