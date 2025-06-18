import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image } from 'lucide-react';
import { newsService } from '../services/api';
import { News, UpdateNewsRequest } from '../types';
import LoadingButton from './LoadingButton';
import FormInput from './FormInput';

interface NewsListProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({ onSuccess, onError }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateNewsRequest>({
    title: '',
    content: '',
    image_path: '',
  });
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (error) {
      onError('Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await newsService.deleteNewsById(id);
      setNews(news.filter(item => item.id !== id));
      onSuccess();
    } catch (error) {
      onError('Error al eliminar la noticia');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setEditFormData({
      title: newsItem.title,
      content: newsItem.content,
      image_path: newsItem.image_path,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    try {
      setActionLoading(prev => ({ ...prev, [editingNews.id]: true }));
      await newsService.updateNewsById(editingNews.id, editFormData);
      
      setNews(news.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...editFormData }
          : item
      ));
      
      setEditingNews(null);
      onSuccess();
    } catch (error) {
      onError('Error al actualizar la noticia');
    } finally {
      setActionLoading(prev => ({ ...prev, [editingNews.id]: false }));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Noticias ({news.length})
        </h3>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No hay noticias disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {news.map((newsItem) => (
            <div key={newsItem.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {editingNews?.id === newsItem.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
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
                    rows={4}
                    required
                  />
                  <FormInput
                    label="Ruta de la Imagen"
                    name="image_path"
                    value={editFormData.image_path}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex space-x-3">
                    <LoadingButton
                      loading={actionLoading[newsItem.id] || false}
                      onClick={() => {}}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Guardar
                    </LoadingButton>
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{newsItem.title}</h4>
                      <p className="text-gray-600 mb-3">{newsItem.content}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Image className="w-4 h-4 mr-1" />
                        <span className="truncate">{newsItem.image_path}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar noticia"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.id)}
                        disabled={actionLoading[newsItem.id]}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar noticia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {newsItem.id}
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

export default NewsList;