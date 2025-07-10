
import React from 'react';

/**
 * This component renders the application logo.
 * It features a custom-designed "HerPath" logo that is pink,
 * educational-themed, and represents women's empowerment.
 */
interface CreedLogoProps {
  size?: number;
  className?: string;
}

const CreedLogo: React.FC<CreedLogoProps> = ({ size = 60, className = '' }) => {
  // A beautiful, custom logo representing the "HerPath" journey of knowledge and empowerment.
  const logoUrl = 'https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/app-images/her_path.png';

  return (
    <img
      src={logoUrl}
      alt="HerPath Logo"
      style={{ width: size, height: size }}
      className={`object-cover rounded-full ${className}`}
    />
  );
};

export default CreedLogo;
