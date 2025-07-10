import React from 'react';
import Button from './Button';

interface DownloadButtonProps {
    onClick: () => void;
    isLoading: boolean;
    className?: string;
    text?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, isLoading, className = '', text = 'Download as PDF' }) => {
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="secondary"
            className={`mt-4 ${className}`}
        >
            {isLoading ? (
                <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Downloading...
                </>
            ) : (
                <>
                    <i className="fas fa-download mr-2"></i>
                    {text}
                </>
            )}
        </Button>
    );
};

export default DownloadButton;
