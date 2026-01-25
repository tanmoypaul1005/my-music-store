import { useEffect } from 'react';

/**
 * Hook to preload audio files for faster playback
 * @param audioSrc - The audio source URL to preload
 * @param shouldPreload - Whether to preload the audio
 */
const useAudioPreload = (audioSrc: string | null, shouldPreload: boolean = true) => {
    useEffect(() => {
        if (!audioSrc || !shouldPreload) return;

        // Create actual audio element for better caching
        const preloadAudio = document.createElement('audio');
        preloadAudio.src = audioSrc;
        preloadAudio.preload = 'auto';
        preloadAudio.volume = 0;
        preloadAudio.load();

        // Also create link element
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'audio';
        preloadLink.href = audioSrc;
        
        document.head.appendChild(preloadLink);

        // Cleanup function
        return () => {
            if (document.head.contains(preloadLink)) {
                document.head.removeChild(preloadLink);
            }
            preloadAudio.src = '';
        };
    }, [audioSrc, shouldPreload]);
};

export default useAudioPreload;
