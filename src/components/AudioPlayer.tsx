import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioAvailable, setIsAudioAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = async () => {
    if (!isAudioAvailable) {
      toast.error("Audio file is unavailable.");
      return;
    }

    if (!audioRef.current) {
      try {
        const audio = new Audio("https://assets.mixkit.co/music/preview/mixkit-lofi-vibe-504.mp3");
        audio.loop = true;
        audio.volume = 0.4;
        audio.onerror = (e) => {
          console.error("Audio loading error:", e);
          setIsAudioAvailable(false);
          toast.error("Could not load external audio asset.");
        };
        audioRef.current = audio;
      } catch (err) {
        console.error("Initialization failed:", err);
        setIsAudioAvailable(false);
        return;
      }
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Playback blocked:", e);
        toast.error("Audio blocked by browser sandbox policy.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!isAudioAvailable) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={togglePlay}
      className="fixed bottom-8 left-8 z-40 p-4 rounded-full bg-base border border-primary/10 text-primary shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-95 group"
      aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
    >
      {isPlaying ? (
        <Volume2 size={20} className="text-accent group-hover:scale-110 transition-transform" />
      ) : (
        <VolumeX size={20} className="opacity-50 group-hover:scale-110 transition-transform group-hover:opacity-100" />
      )}
    </motion.button>
  );
}