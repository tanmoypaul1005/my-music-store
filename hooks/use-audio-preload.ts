import { useEffect } from 'react';

/**
 * Hook to preload audio files for faster playback
 * @param audioSrc - The audio source URL to preload
 * @param shouldPreload - Whether to preload the audio
 */
const useAudioPreload = (audioSrc: string | null, shouldPreload: boolean = true) => {
    useEffect(() => {
        if (!audioSrc || !shouldPreload) return;

        // Create a link element to preload the audio
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'audio';
        preloadLink.href = audioSrc;
        
        // Add to document head
        document.head.appendChild(preloadLink);

        // Cleanup function
        return () => {
            if (document.head.contains(preloadLink)) {
                document.head.removeChild(preloadLink);
            }
        };
    }, [audioSrc, shouldPreload]);
};

export default useAudioPreload;
