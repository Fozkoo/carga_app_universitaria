import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  onClick,
  children,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default LoadingButton;