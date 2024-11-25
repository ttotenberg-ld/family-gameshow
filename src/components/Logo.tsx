import React, { useRef } from 'react';
import { Image } from 'lucide-react';

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <img 
        src={imageUrl} 
        alt="Game Logo" 
        className="max-h-full w-auto object-contain rounded-lg border-4 border-gray-700"
      />
      <button
        onClick={handleButtonClick}
        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Change Logo"
      >
        <Image className="w-5 h-5" />
      </button>
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
