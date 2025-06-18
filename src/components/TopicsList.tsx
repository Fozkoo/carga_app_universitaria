import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { topicService } from '../services/api';
import { Topic, UpdateTopicRequest } from '../types';
import LoadingButton from './LoadingButton';
import FormInput from './FormInput';

interface TopicsListProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ onSuccess, onError }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateTopicRequest>({
    name: '',
    description: '',
  });
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await topicService.getAllTopics();
      setTopics(data);
    } catch (error) {
      onError('Error al cargar los tópicos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este tópico?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await topicService.deleteTopicById(id);
      setTopics(topics.filter(topic => topic.id !== id));
      onSuccess();
    } catch (error) {
      onError('Error al eliminar el tópico');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditFormData({
      name: topic.name,
      description: topic.description,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    try {
      setActionLoading(prev => ({ ...prev, [editingTopic.id]: true }));
      await topicService.updateTopicById(editingTopic.id, editFormData);
      
      setTopics(topics.map(topic => 
        topic.id === editingTopic.id 
          ? { ...topic, ...editFormData }
          : topic
      ));
      
      setEditingTopic(null);
      onSuccess();
    } catch (error) {
      onError('Error al actualizar el tópico');
    } finally {
      setActionLoading(prev => ({ ...prev, [editingTopic.id]: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tópicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Tópicos ({topics.length})
        </h3>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No hay tópicos disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {editingTopic?.id === topic.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{topic.name}</h4>
                  <FormInput
                    label="Nombre"
                    name="name"
                    placeholder={topic.name}
                    value={editFormData.name}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Descripción"
                    name="description"
                    placeholder={topic.description}
                    value={editFormData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                  />
                  <div className="flex space-x-3">
                    <LoadingButton
                      loading={actionLoading[topic.id] || false}
                      onClick={() => {}}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Guardar
                    </LoadingButton>
                    <button
                      type="button"
                      onClick={() => setEditingTopic(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{topic.name}</h4>
                      <p className="text-gray-600">{topic.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar tópico"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        disabled={actionLoading[topic.id]}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar tópico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {topic.id}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsList;