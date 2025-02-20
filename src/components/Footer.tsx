import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Home className="h-8 w-8 text-rose-600" />
              <span className="ml-2 text-xl font-semibold">Desireé Lucchesi</span>
            </div>
            <p className="mt-4 text-gray-400">
              Especialista em imóveis de alto padrão e lançamentos exclusivos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white">Início</a></li>
              <li><a href="#launches" className="text-gray-400 hover:text-white">Lançamentos</a></li>
              <li><a href="#properties" className="text-gray-400 hover:text-white">Imóveis</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Imóveis</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Apartamentos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Casas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Comercial</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Lançamentos</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">CRECI</h3>
            <p className="text-gray-400">CRECI-SP 123456</p>
            <div className="mt-4 text-gray-400">
              <p>São Paulo - SP</p>
              <p className="mt-2 font-mono">{formatDateTime(currentTime)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400">
            © {currentTime.getFullYear()} Desireé Lucchesi. Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}