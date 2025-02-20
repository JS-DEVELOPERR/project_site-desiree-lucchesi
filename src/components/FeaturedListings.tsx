import React, { useEffect, useState } from 'react';
import { MapPin, Bed, Bath, Square, Car } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropertyDetails from './PropertyDetails';

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    loadFeaturedListings();
  }, []);

  const loadFeaturedListings = async () => {
    try {
      // Primeiro, tenta carregar as propriedades em destaque
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_properties')
        .select(`
          position,
          property:properties (
            id,
            title,
            description,
            location,
            price,
            status,
            bedrooms,
            suites,
            bathrooms,
            parking_spots,
            area,
            amenities,
            images
          )
        `)
        .eq('active', true)
        .order('position');

      if (featuredError) throw featuredError;

      // Se não houver propriedades em destaque, carrega as mais recentes
      if (!featuredData || featuredData.length === 0) {
        const { data: recentData, error: recentError } = await supabase
          .from('properties')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (recentError) throw recentError;
        setListings(recentData || getDefaultListings());
      } else {
        // Mapeia os dados das propriedades em destaque
        const activeListings = featuredData
          .filter(item => item.property)
          .map(item => item.property)
          .filter(Boolean);

        setListings(activeListings.length > 0 ? activeListings : getDefaultListings());
      }
    } catch (err) {
      console.error('Error loading featured listings:', err);
      setError('Não foi possível carregar os imóveis. Por favor, tente novamente mais tarde.');
      setListings(getDefaultListings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultListings = () => [
    {
      id: 1,
      title: 'Apartamento de Luxo',
      description: 'Luxuoso apartamento com acabamento premium, localizado em uma das regiões mais valorizadas de São Paulo. Possui ampla área social, varanda gourmet e vista panorâmica da cidade.',
      location: 'Jardins, São Paulo',
      price: 2500000,
      status: 'launch',
      bedrooms: 4,
      suites: 2,
      bathrooms: 3,
      parking_spots: 3,
      area: 180,
      amenities: ['Piscina', 'Academia', 'Varanda Gourmet'],
      images: []
    },
    {
      id: 2,
      title: 'Casa em Condomínio',
      description: 'Magnífica casa em condomínio fechado com total infraestrutura de lazer e segurança. Projeto arquitetônico moderno com ambientes integrados e acabamento de alto padrão.',
      location: 'Alphaville, Barueri',
      price: 3800000,
      status: 'new',
      bedrooms: 5,
      suites: 3,
      bathrooms: 4,
      parking_spots: 4,
      area: 350,
      amenities: ['Área Verde', 'Segurança 24h', 'Lazer Completo'],
      images: []
    },
    {
      id: 3,
      title: 'Cobertura Duplex',
      description: 'Espetacular cobertura duplex com terraço e vista privilegiada. Ambientes amplos e bem iluminados, perfect para quem busca exclusividade e sofisticação.',
      location: 'Vila Nova Conceição, São Paulo',
      price: 4500000,
      status: 'used',
      bedrooms: 3,
      suites: 3,
      bathrooms: 4,
      parking_spots: 3,
      area: 240,
      amenities: ['Vista Panorâmica', 'Terraço', 'Churrasqueira'],
      images: []
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Imóveis em Destaque</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="properties" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Imóveis em Destaque</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Conheça nossa seleção de propriedades exclusivas
          </p>
          {error && (
            <div className="mt-4 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing: any) => (
            <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img
                  src={listing.images?.[0] ? 
                    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/properties/${listing.images[0]}` :
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  }
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full">
                  R$ {Number(listing.price).toLocaleString('pt-BR')}
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full">
                  {listing.status === 'launch' ? 'Lançamento' :
                   listing.status === 'new' ? 'Novo' : 'Usado'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{listing.title}</h3>
                <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {listing.bedrooms} Dormitórios ({listing.suites} suítes)
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {listing.bathrooms} Banheiros
                  </div>
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    {listing.parking_spots} Vagas
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {listing.area}m²
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Diferenciais:</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities?.map((amenity: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={() => setSelectedProperty(listing)}
                    className="flex-1 bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors duration-200"
                  >
                    Mais Detalhes
                  </button>
                  <button 
                    onClick={scrollToContact}
                    className="flex-1 border border-rose-600 text-rose-600 dark:text-rose-400 py-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900 transition-colors duration-200"
                  >
                    Agendar Visita
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}