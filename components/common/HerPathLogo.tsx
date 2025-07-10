import React from 'react';

/**
 * This component renders the application logo.
 * The logo used is for the CREED NGO.
 */
interface HerPathLogoProps {
  size?: number;
  className?: string;
}

const HerPathLogo: React.FC<HerPathLogoProps> = ({ size = 60, className = '' }) => {
  // URL for the CREED NGO logo, updated as per user request.
  const logoUrl = 'https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/app-images/WhatsApp%20Image%202025-07-01%20at%2014.08.42.jpeg';

  return (
    <img
      src={logoUrl}
      alt="CREED NGO Logo"
      style={{ width: size, height: size }}
      className={`object-cover rounded-full ${className}`}
    />
  );
};

export default HerPathLogo;
