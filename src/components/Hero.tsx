import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    suites: '',
    parkingSpots: '',
    propertyStatus: ''
  });

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let query = supabase
        .from('properties')
        .select('*');

      if (searchParams.location) {
        query = query.ilike('location', `%${searchParams.location}%`);
      }

      if (searchParams.propertyType) {
        query = query.eq('type', searchParams.propertyType);
      }

      if (searchParams.propertyStatus) {
        query = query.eq('status', searchParams.propertyStatus);
      }

      if (searchParams.bedrooms) {
        query = query.gte('bedrooms', parseInt(searchParams.bedrooms));
      }

      if (searchParams.suites) {
        query = query.gte('suites', parseInt(searchParams.suites));
      }

      if (searchParams.parkingSpots) {
        query = query.gte('parking_spots', parseInt(searchParams.parkingSpots));
      }

      if (searchParams.priceRange) {
        const [min, max] = searchParams.priceRange.split('-');
        if (min) query = query.gte('price', parseInt(min));
        if (max) query = query.lte('price', parseInt(max));
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Salvar a busca no histórico
      await supabase.from('property_search').insert({
        location: searchParams.location,
        property_type: searchParams.propertyType,
        status: searchParams.propertyStatus,
        price_range_min: searchParams.priceRange ? parseInt(searchParams.priceRange.split('-')[0]) : null,
        price_range_max: searchParams.priceRange ? parseInt(searchParams.priceRange.split('-')[1]) : null,
        bedrooms: searchParams.bedrooms ? parseInt(searchParams.bedrooms) : null,
        suites: searchParams.suites ? parseInt(searchParams.suites) : null,
        parking_spots: searchParams.parkingSpots ? parseInt(searchParams.parkingSpots) : null
      });

      setSearchResults(data || []);
      
      // Scroll to properties section
      const propertiesSection = document.getElementById('properties');
      if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      location: '',
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      suites: '',
      parkingSpots: '',
      propertyStatus: ''
    });
  };

  return (
    <div id="home" className="relative pt-16">
      <div className="absolute inset-0">
        <img
          className="w-full h-[600px] object-cover"
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80"
          alt="Luxury home exterior"
        />
        <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" />
      </div>

      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Encontre o Imóvel dos Seus Sonhos
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-100">
          Especialista em imóveis de alto padrão, lançamentos e empreendimentos exclusivos.
        </p>

        <div className="mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização
                    </label>
                    <input
                      type="text"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                      placeholder="Bairro, cidade ou região"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Imóvel
                    </label>
                    <select
                      value={searchParams.propertyType}
                      onChange={(e) => setSearchParams({...searchParams, propertyType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="apartment">Apartamento</option>
                      <option value="house">Casa</option>
                      <option value="mansion">Mansão</option>
                      <option value="townhouse">Sobrado</option>
                      <option value="commercial">Comercial</option>
                      <option value="land">Terreno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={searchParams.propertyStatus}
                      onChange={(e) => setSearchParams({...searchParams, propertyStatus: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="">Todos</option>
                      <option value="launch">Lançamento</option>
                      <option value="new">Novo</option>
                      <option value="used">Usado</option>
                    </select>
                  </div>
                </div>

                {showAdvancedSearch && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faixa de Preço
                      </label>
                      <select
                        value={searchParams.priceRange}
                        onChange={(e) => setSearchParams({...searchParams, priceRange: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Qualquer valor</option>
                        <option value="0-500000">Até R$ 500.000</option>
                        <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
                        <option value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</option>
                        <option value="2000000-5000000">R$ 2.000.000 - R$ 5.000.000</option>
                        <option value="5000000-">Acima de R$ 5.000.000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dormitórios
                      </label>
                      <select
                        value={searchParams.bedrooms}
                        onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Qualquer</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suítes
                      </label>
                      <select
                        value={searchParams.suites}
                        onChange={(e) => setSearchParams({...searchParams, suites: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Qualquer</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vagas
                      </label>
                      <select
                        value={searchParams.parkingSpots}
                        onChange={(e) => setSearchParams({...searchParams, parkingSpots: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Qualquer</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                  >
                    {showAdvancedSearch ? 'Busca Simples' : 'Busca Avançada'}
                  </button>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Imóveis
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}