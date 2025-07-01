
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, onClick, hoverEffect = false, ...rest }) => {
  const baseStyle = `bg-white shadow-lg rounded-xl overflow-hidden ${onClick ? 'cursor-pointer' : ''}`;
  const hoverStyle = hoverEffect ? 'transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105' : '';
  
  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} onClick={onClick} {...rest}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-teal-700">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;