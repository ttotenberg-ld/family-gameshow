import React, { useRef } from 'react';

interface LogoProps {
  imageUrl: string;
  onImageChange: (newUrl: string) => void;
}

const Logo: React.FC<LogoProps> = ({ imageUrl, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <img 
        src={imageUrl} 
        alt="Game Logo" 
        className="max-h-full w-auto object-contain rounded-lg border-4 border-gray-700"
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Logo;
