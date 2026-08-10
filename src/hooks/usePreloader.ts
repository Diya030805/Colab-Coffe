import { useState, useEffect } from 'react';

export function usePreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if preloader was already seen in this session
    const hasSeenPreloader = sessionStorage.getItem('preloaderSeen');
    
    if (hasSeenPreloader === 'true') {
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    // Simulate asset loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Minimum display time for the luxury experience
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('preloaderSeen', 'true');
      
      // Delay the "complete" state slightly to allow exit animations to trigger
      setTimeout(() => {
        setIsComplete(true);
      }, 150);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return {
    isLoading,
    progress,
    isComplete
  };
}
