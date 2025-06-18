import React, { useState } from 'react';
import { newsService } from '../services/api';
import { CreateNewsRequest } from '../types';
import FormInput from './FormInput';
import LoadingButton from './LoadingButton';

interface NewsFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: '',
    content: '',
    image_path: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await newsService.createNews(formData);
      onSuccess();
      setFormData({ title: '', content: '', image_path: '' });
    } catch (error) {
      onError('Error al crear la noticia. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Título de la Noticia"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ingresa el título de la noticia"
        required
      />
      
      <FormInput
        label="Contenido"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Escribe el contenido de la noticia..."
        multiline
        rows={6}
        required
      />

      <FormInput
        label="Ruta de la Imagen"
        name="image_path"
        value={formData.image_path}
        onChange={handleChange}
        placeholder="URL o ruta de la imagen"
        required
      />

      <div className="flex justify-end space-x-4 pt-4">
        <LoadingButton loading={loading} onClick={() => {}}>
          {loading ? 'Creando...' : 'Crear Noticia'}
        </LoadingButton>
      </div>
    </form>
  );
};

export default NewsForm;