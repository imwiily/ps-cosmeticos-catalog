import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contato" className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-4xl font-serif text-amber-800 mb-8">Entre em Contato</h3>
        <p className="text-xl text-amber-700 mb-12">
          Siga nosso perfil, acompanhe as novidades e promoções, e descubra tudo que temos para oferecer!
        </p>
        
        <div className="flex justify-center gap-8 mb-12">
          <a href="#" className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all">
            <Instagram size={24} />
            Instagram
          </a>
          <a href="#" className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all">
            <Facebook size={24} />
            Facebook
          </a>
          <a href="#" className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all">
            <MessageCircle size={24} />
            WhatsApp
          </a>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
          <h4 className="text-xl font-semibold text-amber-800 mb-4">Informações de Contato</h4>
          <p className="text-amber-700 mb-2">📧 contato@pscosmeticos.com.br</p>
          <p className="text-amber-700 mb-2">📱 (11) 99999-9999</p>
          <p className="text-amber-700">🕐 Seg à Sex: 9h às 18h</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;