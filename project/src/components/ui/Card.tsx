import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-md transition-all duration-300 ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};