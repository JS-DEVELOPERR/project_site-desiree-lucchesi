import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface PropertyFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export default function PropertyForm({ onSuccess, initialData }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    location: initialData?.location || '',
    type: initialData?.type || '',
    status: initialData?.status || '',
    bedrooms: initialData?.bedrooms || '',
    suites: initialData?.suites || '',
    bathrooms: initialData?.bathrooms || '',
    parking_spots: initialData?.parking_spots || '',
    area: initialData?.area || '',
    amenities: initialData?.amenities || [],
    images: initialData?.images || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      const propertyData = {
        ...formData,
        created_by: userData.user.id
      };

      if (initialData) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        return filePath;
      });

      const newImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (err: any) {
      setError('Erro ao fazer upload das imagens');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço</label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Localização</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="">Selecione o tipo</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
            <option value="land">Terreno</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="">Selecione o status</option>
            <option value="launch">Lançamento</option>
            <option value="new">Novo</option>
            <option value="used">Usado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dormitórios</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Suítes</label>
          <input
            type="number"
            value={formData.suites}
            onChange={(e) => setFormData(prev => ({ ...prev, suites: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Banheiros</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vagas de Garagem</label>
          <input
            type="number"
            value={formData.parking_spots}
            onChange={(e) => setFormData(prev => ({ ...prev, parking_spots: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
          <input
            type="number"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Imagens</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full"
        />
        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="relative">
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/properties/${image}`}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index)
                  }))}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Diferenciais</label>
        <input
          type="text"
          value={formData.amenities.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            amenities: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
          }))}
          placeholder="Separe os diferenciais por vírgula"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}