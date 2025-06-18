import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-emerald-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-emerald-600' : 'text-red-600';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} border border-current/20 rounded-lg p-4 max-w-sm shadow-lg`}>
        <div className="flex items-start">
          <Icon className={`${iconColor} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
          <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
          <button
            onClick={onClose}
            className={`${textColor} ml-2 flex-shrink-0 hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;