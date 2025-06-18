import React, { useState } from 'react';
import { topicService } from '../services/api';
import { CreateTopicRequest } from '../types';
import FormInput from './FormInput';
import LoadingButton from './LoadingButton';

interface TopicFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<CreateTopicRequest>({
    name: '',
    description: '',
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
      await topicService.createTopic(formData);
      onSuccess();
      setFormData({ name: '', description: '' });
    } catch (error) {
      onError('Error al crear el tópico. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nombre del Tópico"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ingresa el nombre del tópico"
        required
      />
      
      <FormInput
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe el tópico..."
        multiline
        rows={4}
        required
      />

      <div className="flex justify-end space-x-4 pt-4">
        <LoadingButton loading={loading} onClick={() => {}}>
          {loading ? 'Creando...' : 'Crear Tópico'}
        </LoadingButton>
      </div>
    </form>
  );
};

export default TopicForm;