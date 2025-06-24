import React, { useState, useEffect } from 'react';
import { moduleService, topicService } from '../services/api';
import { CreateModuleRequest, Topic } from '../types';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import LoadingButton from './LoadingButton';

interface ModuleFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<CreateModuleRequest>({
    title: '',
    content: '',
    date_create: '',
    date_delete: '',
    image_path: '',
    topic_idtopic: 0,
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await topicService.getAllTopics();
        setTopics(topicsData);
      } catch (error) {
        onError('Error al cargar los tópicos. Asegúrate de que el servidor esté ejecutándose.');
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [onError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'topic_idtopic' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await moduleService.createModule(formData);
      onSuccess();
      setFormData({
        title: '',
        content: '',
        date_create: '',
        date_delete: '',
        image_path: '',
        topic_idtopic: 0,
      });
    } catch (error) {
      onError('Error al crear el módulo. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTopics) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tópicos...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      <FormInput
        label="Título del Módulo"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ingresa el título del módulo"
        required
      />
      
      <FormInput
        label="Contenido"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Describe el contenido del módulo..."
        multiline
        rows={4}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Fecha de Creación"
          name="date_create"
          type="date"
          value={formData.date_create}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Fecha de Eliminación"
          name="date_delete"
          type="date"
          value={formData.date_delete}
          onChange={handleChange}
          required
        />
      </div>

      <FormInput
        label="Ruta de la Imagen"
        name="image_path"
        value={formData.image_path}
        onChange={handleChange}
        placeholder="URL o ruta de la imagen"
        required
      />

      <FormSelect
        label="Tópico"
        name="topic_idtopic"
        value={formData.topic_idtopic}
        onChange={handleChange}
        options={topics.map(topic => ({
          value: topic.idtopic,
          label: topic.name
        }))}
        placeholder="Selecciona un tópico"
        required
      />

      <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white">
        <LoadingButton loading={loading} onClick={() => {}}>
          {loading ? 'Creando...' : 'Crear Módulo'}
        </LoadingButton>
      </div>
    </form>
  );
};

export default ModuleForm;