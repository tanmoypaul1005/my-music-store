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
            const STORAGE_NAME = process.env.NEXT_PUBLIC_APP_STORE;
            const storedData = localStorage.getItem(STORAGE_NAME);

            if (storedData) {
                const appData: AppLocalStorage = JSON.parse(storedData);
                setInitialApp(appData);

                // Preload the current music if it exists
                if (appData.currentMusic && appData.currentMusic.src) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'audio';
                    preloadLink.href = appData.currentMusic.src;
                    document.head.appendChild(preloadLink);
                }

                // Preload first music from playlist if exists
                if (appData.playList && appData.playList.length > 0 && !appData.currentMusic) {
                    const firstMusic = appData.playList[0];
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'audio';
                    preloadLink.href = firstMusic.src;
                    document.head.appendChild(preloadLink);
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
