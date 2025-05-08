import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}></div>
    </div>
  );
};

export default Loading;