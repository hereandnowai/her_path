
import React from 'react';
import { NGO_NAME } from '../../constants'; // For alt text
import { useLanguage } from '../../contexts/LanguageContext'; // For alt text

interface CreedLogoProps {
  size?: number;
  className?: string;
}

const CreedLogo: React.FC<CreedLogoProps> = ({ size = 60, className = '' }) => {
  const { translate } = useLanguage();
  const logoUrl = "https://raw.githubusercontent.com/Rashinisuresh/ngo_project/refs/heads/main/WhatsApp%20Image%202025-06-23%20at%2016.36.22_c520360a.jpg";
  const altText = `${translate('ngoName', NGO_NAME)} Logo`;

  return (
    <img
      src={logoUrl}
      alt={altText}
      width={size}
      height={size}
      className={`object-contain ${className}`} // Added object-contain to prevent distortion
      style={{ width: size, height: size }} // Ensure size is applied
    />
  );
};

export default CreedLogo;
