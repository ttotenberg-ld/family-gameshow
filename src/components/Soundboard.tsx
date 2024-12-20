import { useState, useEffect } from 'react';

interface SoundButton {
  name: string;
  file: string;
  emoji: string;
}

const getFullPath = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL;
  // Remove any leading slash from the path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

const sounds: SoundButton[] = [
  { name: 'Sad Trombone', file: 'sounds/sad-trombone.mp3', emoji: '🎺' },
  { name: 'Cheering', file: 'sounds/cheering.mp3', emoji: '👏' },
  { name: 'Booing', file: 'sounds/booing.mp3', emoji: '👎' },
  { name: 'Fart', file: 'sounds/fart.mp3', emoji: '💨' },
  { name: 'Whee', file: 'sounds/whee.mp3', emoji: '🎢' },
  { name: 'Crickets', file: 'sounds/crickets.mp3', emoji: '🦗' },
  { name: 'Huh', file: 'sounds/huh.mp3', emoji: '🤔' },
  { name: 'Joke', file: 'sounds/joke.mp3', emoji: '😄' },
];

export default function Soundboard() {
  // Create a map to store preloaded audio objects
  const [audioMap] = useState<Map<string, HTMLAudioElement>>(() => {
    const map = new Map();
    sounds.forEach(sound => {
      const fullPath = getFullPath(sound.file);
      const audio = new Audio(fullPath);
      audio.preload = 'auto';
      map.set(sound.file, audio);
    });
    return map;
  });

  useEffect(() => {
    // Cleanup function to remove audio elements
    return () => {
      audioMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioMap.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSound = (file: string) => {
    const audio = audioMap.get(file);
    if (audio) {
      // Reset the audio to start if it's already playing
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
        // If there's an error, try creating a new audio instance
        const fullPath = getFullPath(file);
        const newAudio = new Audio(fullPath);
        newAudio.play().catch(e => console.error('Fallback audio error:', e));
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="w-full text-xl font-bold mb-2">Soundboard</h2>
      <div className="flex flex-wrap gap-2">
        {sounds.map((sound) => (
          <button
            key={sound.name}
            onClick={() => playSound(sound.file)}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 rounded-md shadow-sm 
                     transition-colors duration-200 flex items-center gap-2"
          >
            <span>{sound.emoji}</span>
            <span>{sound.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 