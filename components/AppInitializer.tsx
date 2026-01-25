"use client"
import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

/**
 * Component to initialize app store from localStorage and preload first audio
 */
const AppInitializer = () => {
    const setInitialApp = useAppStore(state => state.setInitialApp);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Register service worker for production caching
            if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
            }

            const STORAGE_NAME = process.env.NEXT_PUBLIC_APP_STORE;
            const storedData = localStorage.getItem(STORAGE_NAME);
            const isProduction = process.env.NODE_ENV === 'production';

            if (storedData) {
                const appData: AppLocalStorage = JSON.parse(storedData);
                setInitialApp(appData);

                // Preload the current music if it exists with high priority
                if (appData.currentMusic && appData.currentMusic.src) {
                    // Create hidden audio element for preloading
                    const preloadAudio = document.createElement('audio');
                    preloadAudio.src = appData.currentMusic.src;
                    preloadAudio.preload = 'auto';
                    preloadAudio.load();
                    
                    // Also add link preload
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'audio';
                    preloadLink.href = appData.currentMusic.src;
                    document.head.appendChild(preloadLink);
                }

                // PRODUCTION: Aggressive preloading - load ALL songs in background
                if (isProduction && appData.playList && appData.playList.length > 0) {
                    // Preload all songs aggressively in production
                    appData.playList.forEach((music, index) => {
                        setTimeout(() => {
                            // Use fetch to cache audio files
                            fetch(music.src, { 
                                mode: 'cors',
                                credentials: 'same-origin',
                                cache: 'force-cache'
                            }).catch(() => {});
                            
                            // Also add prefetch links
                            const preloadLink = document.createElement('link');
                            preloadLink.rel = 'prefetch';
                            preloadLink.as = 'audio';
                            preloadLink.href = music.src;
                            document.head.appendChild(preloadLink);
                        }, index * 50); // Stagger by 50ms to avoid blocking
                    });
                } else if (!isProduction && appData.playList && appData.playList.length > 0) {
                    // DEVELOPMENT: Only preload first 3 songs
                    const songsToPreload = appData.playList.slice(0, 3);
                    songsToPreload.forEach((music, index) => {
                        setTimeout(() => {
                            const preloadLink = document.createElement('link');
                            preloadLink.rel = index === 0 ? 'preload' : 'prefetch';
                            preloadLink.as = 'audio';
                            preloadLink.href = music.src;
                            document.head.appendChild(preloadLink);
                        }, index * 100);
                    });
                }
            } else {
                // Initialize with default values if no stored data
                const defaultData: AppLocalStorage = {
                    currentMusic: null,
                    isPlaying: false,
                    repeatType: "all",
                    volume: 1,
                    playList: [],
                    playListId: "",
                    shuffleIndex: [],
                    currentMusicTime: 0
                };
                localStorage.setItem(STORAGE_NAME, JSON.stringify(defaultData));
                setInitialApp(defaultData);
            }
        }
    }, [setInitialApp]);

    return null;
};

export default AppInitializer;
