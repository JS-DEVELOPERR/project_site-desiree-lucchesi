import React from 'react';
import { X, MapPin, Bed, Bath, Square, Car } from 'lucide-react';

interface PropertyDetailsProps {
  property: any;
  onClose: () => void;
}

export default function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{property.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {property.images?.map((image: string, index: number) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/properties/${image}`}
                alt={`${property.title} - Imagem ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Property Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Bed className="w-5 h-5 mr-2" />
                  {property.bedrooms} Dormitórios
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Bath className="w-5 h-5 mr-2" />
                  {property.bathrooms} Banheiros
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Car className="w-5 h-5 mr-2" />
                  {property.parking_spots} Vagas
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Square className="w-5 h-5 mr-2" />
                  {property.area}m²
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Valor</h3>
                <p className="text-2xl font-bold text-rose-600">
                  R$ {Number(property.price).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 'launch' ? 'bg-blue-100 text-blue-800' :
                  property.status === 'new' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.status === 'launch' ? 'Lançamento' :
                   property.status === 'new' ? 'Novo' : 'Usado'}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Diferenciais</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities?.map((amenity: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    onClose();
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors duration-200"
              >
                Agendar Visita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}