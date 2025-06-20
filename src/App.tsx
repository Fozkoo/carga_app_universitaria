import { useState } from 'react';
import { BookOpen, Newspaper, Layers, GraduationCap, Eye, FileText, Database } from 'lucide-react';
import Modal from './components/Modal';
import TopicForm from './components/TopicForm';
import NewsForm from './components/NewsForm';
import ModuleForm from './components/ModuleForm';
import TopicsList from './components/TopicsList';
import NewsList from './components/NewsList';
import ModulesList from './components/ModulesList';
import NotificationToast from './components/NotificationToast';

type ModalType = 'topic' | 'news' | 'module' | 'viewTopics' | 'viewNews' | 'viewModules' | null;

interface Notification {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
}

function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [notification, setNotification] = useState<Notification>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSuccess = () => {
    setActiveModal(null);
    showNotification('success', '¡Operación completada exitosamente!');
  };

  const handleError = (message: string) => {
    showNotification('error', message);
  };

  const actionCards = [
    {
      id: 'topic',
      title: 'Crear Nuevo Tópico',
      description: 'Crea y organiza tópicos académicos para estructurar el contenido universitario. Los tópicos te permiten categorizar y organizar el material educativo de manera lógica y jerárquica, facilitando la navegación y comprensión del contenido.',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-700',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'news',
      title: 'Crear Noticia',
      description: 'Publica noticias y anuncios importantes para la comunidad universitaria. Mantén informados a estudiantes, profesores y personal sobre eventos, cambios académicos, fechas importantes y cualquier información relevante para la institución.',
      icon: Newspaper,
      gradient: 'from-emerald-500 to-emerald-700',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'module',
      title: 'Crear Módulo',
      description: 'Desarrolla módulos educativos completos con contenido multimedia y fechas específicas. Los módulos pueden incluir videos, documentos, enlaces y recursos interactivos, organizados por tópicos y con fechas de inicio y finalización.',
      icon: Layers,
      gradient: 'from-amber-500 to-amber-700',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'viewTopics',
      title: 'Ver Todos los Tópicos',
      description: 'Visualiza, edita y gestiona todos los tópicos académicos existentes. Revisa la estructura de contenido, modifica descripciones, reorganiza jerarquías y mantén actualizada la organización del material educativo.',
      icon: Eye,
      gradient: 'from-purple-500 to-purple-700',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'viewNews',
      title: 'Ver Todas las Noticias',
      description: 'Administra y actualiza todas las noticias publicadas en la plataforma. Revisa el historial de publicaciones, edita contenido existente, elimina noticias obsoletas y mantén la información actualizada y relevante.',
      icon: FileText,
      gradient: 'from-rose-500 to-rose-700',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      id: 'viewModules',
      title: 'Ver Todos los Módulos',
      description: 'Gestiona y modifica todos los módulos educativos del sistema. Revisa el contenido multimedia, actualiza fechas, modifica recursos, reorganiza el material y asegúrate de que todos los módulos estén actualizados y funcionando correctamente.',
      icon: Database,
      gradient: 'from-indigo-500 to-indigo-700',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg mr-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Carga APP UNIVERSITARIA</h1>
                <p className="text-xs text-gray-600 mt-1">Sistema de gestión de contenido académico</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Gestiona tu Contenido Académico
          </h2>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[300px]"
                onClick={() => setActiveModal(card.id as ModalType)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="p-6">
                  <div className={`${card.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${card.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {card.description}
                  </p>
                  
                  <div className={`inline-flex items-center text-xs font-semibold ${card.color} group-hover:translate-x-1 transition-transform duration-200`}>
                    Comenzar
                    <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Create Modals */}
      <Modal
        isOpen={activeModal === 'topic'}
        onClose={() => setActiveModal(null)}
        title="Crear Nuevo Tópico"
      >
        <TopicForm onSuccess={handleSuccess} onError={handleError} />
      </Modal>

      <Modal
        isOpen={activeModal === 'news'}
        onClose={() => setActiveModal(null)}
        title="Crear Nueva Noticia"
      >
        <NewsForm onSuccess={handleSuccess} onError={handleError} />
      </Modal>

      <Modal
        isOpen={activeModal === 'module'}
        onClose={() => setActiveModal(null)}
        title="Crear Nuevo Módulo"
      >
        <ModuleForm onSuccess={handleSuccess} onError={handleError} />
      </Modal>

      {/* View/Manage Modals */}
      <Modal
        isOpen={activeModal === 'viewTopics'}
        onClose={() => setActiveModal(null)}
        title="Gestionar Tópicos"
      >
        <TopicsList onSuccess={() => showNotification('success', '¡Operación completada exitosamente!')} onError={handleError} />
      </Modal>

      <Modal
        isOpen={activeModal === 'viewNews'}
        onClose={() => setActiveModal(null)}
        title="Gestionar Noticias"
      >
        <NewsList onSuccess={() => showNotification('success', '¡Operación completada exitosamente!')} onError={handleError} />
      </Modal>

      <Modal
        isOpen={activeModal === 'viewModules'}
        onClose={() => setActiveModal(null)}
        title="Gestionar Módulos"
      >
        <ModulesList onSuccess={() => showNotification('success', '¡Operación completada exitosamente!')} onError={handleError} />
      </Modal>

      {/* Notification Toast */}
      <NotificationToast
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App;