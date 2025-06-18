import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Calendar, Image } from 'lucide-react';
import { moduleService, topicService } from '../services/api';
import { Module, Topic, UpdateModuleRequest } from '../types';
import LoadingButton from './LoadingButton';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface ModulesListProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ModulesList: React.FC<ModulesListProps> = ({ onSuccess, onError }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateModuleRequest>({
    title: '',
    content: '',
    date_create: '',
    date_delete: '',
    image_path: '',
    topic_idtopic: 0,
  });
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchModules();
    fetchTopics();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.getAllModules();
      setModules(data);
    } catch (error) {
      onError('Error al cargar los módulos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const data = await topicService.getAllTopics();
      setTopics(data);
    } catch (error) {
      onError('Error al cargar los tópicos');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este módulo?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await moduleService.deleteModuleById(id);
      setModules(modules.filter(module => module.id !== id));
      onSuccess();
    } catch (error) {
      onError('Error al eliminar el módulo');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setEditFormData({
      title: module.title,
      content: module.content,
      date_create: module.date_create,
      date_delete: module.date_delete,
      image_path: module.image_path,
      topic_idtopic: module.topic_idtopic,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      setActionLoading(prev => ({ ...prev, [editingModule.id]: true }));
      await moduleService.updateModuleById(editingModule.id, editFormData);
      
      setModules(modules.map(module => 
        module.id === editingModule.id 
          ? { ...module, ...editFormData }
          : module
      ));
      
      setEditingModule(null);
      onSuccess();
    } catch (error) {
      onError('Error al actualizar el módulo');
    } finally {
      setActionLoading(prev => ({ ...prev, [editingModule.id]: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'topic_idtopic' ? parseInt(value) : value,
    }));
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : `Tópico ${topicId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Módulos ({modules.length})
        </h3>
      </div>

      {modules.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No hay módulos disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {modules.map((module) => (
            <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {editingModule?.id === module.id ? (
                <form onSubmit={handleUpdate} className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <FormInput
                    label="Título"
                    name="title"
                    value={editFormData.title}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Contenido"
                    name="content"
                    value={editFormData.content}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Fecha de Creación"
                      name="date_create"
                      type="date"
                      value={editFormData.date_create}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Fecha de Eliminación"
                      name="date_delete"
                      type="date"
                      value={editFormData.date_delete}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <FormInput
                    label="Ruta de la Imagen"
                    name="image_path"
                    value={editFormData.image_path}
                    onChange={handleChange}
                    required
                  />
                  <FormSelect
                    label="Tópico"
                    name="topic_idtopic"
                    value={editFormData.topic_idtopic}
                    onChange={handleChange}
                    options={topics.map(topic => ({
                      value: topic.id,
                      label: topic.name
                    }))}
                    required
                  />
                  <div className="flex space-x-3 sticky bottom-0 bg-white pt-4">
                    <LoadingButton
                      loading={actionLoading[module.id] || false}
                      onClick={() => {}}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Guardar
                    </LoadingButton>
                    <button
                      type="button"
                      onClick={() => setEditingModule(null)}
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h4>
                      <p className="text-gray-600 mb-3">{module.content}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Creación: {module.date_create}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Eliminación: {module.date_delete}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Image className="w-4 h-4 mr-1" />
                        <span className="truncate">{module.image_path}</span>
                      </div>
                      
                      <div className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        {getTopicName(module.topic_idtopic)}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(module)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar módulo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
                        disabled={actionLoading[module.id]}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar módulo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {module.id}
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

export default ModulesList;