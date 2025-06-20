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
      onError('Error al cargar las noticias' + error);
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
      setNews(news.filter(item => item.idnews !== id));
      onSuccess();
    } catch (error) {
      onError('Error al eliminar la noticia' + error);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem); // debug cami
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
      setActionLoading(prev => ({ ...prev, [editingNews.idnews]: true }));
      await newsService.updateNewsById(editingNews.idnews, editFormData);
      
      setNews(news.map(item => 
        item.idnews === editingNews.idnews 
          ? { ...item, ...editFormData }
          : item
      ));
      
      setEditingNews(null);
      onSuccess();
    } catch (error) {
      onError('Error al actualizar la noticia' + error);
    } finally {
      setActionLoading(prev => ({ ...prev, [editingNews.idnews]: false }));
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
        <div className="grid grid-cols-1 gap-4">
          {news.map((newsItem) => (
            <div key={newsItem.idnews} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              {editingNews?.idnews === newsItem.idnews ? (
                <form onSubmit={handleUpdate} className="space-y-3">
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
                  <FormInput
                    label="Ruta de la Imagen"
                    name="image_path"
                    value={editFormData.image_path}
                    onChange={handleChange}
                  />
                  <div className="flex space-x-2">
                    <LoadingButton
                      loading={actionLoading[newsItem.idnews] || false}
                      onClick={() => {}}
                      className="bg-emerald-600 hover:bg-emerald-700 text-sm px-3 py-1"
                    >
                      Guardar
                    </LoadingButton>
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {newsItem.title || 'Sin título'}
                      </h4>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        {newsItem.content || 'Sin contenido'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Image className="w-3 h-3 mr-1" />
                        <span className="truncate">{newsItem.image_path || 'Sin imagen'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar noticia"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.idnews)}
                        disabled={actionLoading[newsItem.idnews]}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar noticia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {newsItem.idnews}
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