"use client"
import { useEffect } from "react";
import IndexTrends from "./trends/IndexTrends";
import IndexArtits from "./artists/IndexArtists";
import IndexTopChart from "./top-chart/IndexTopChart";
import PopularArtists from "./popular-artists/PopularArtists";
import styles from './Index.module.scss'

const Index = ({
    trends,
    topArtists,
    topMusics,
}: {
    trends: Music[],
    topArtists: Artist[],
    topMusics: Music[],
}) => {
    // Preload first music from top charts for faster initial playback
    useEffect(() => {
        if (topMusics && topMusics.length > 0) {
            const firstMusic = topMusics[0];

            // Preload using link element
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'audio';
            preloadLink.href = firstMusic.src;
            document.head.appendChild(preloadLink);

            // Additionally create an audio element to cache it
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = firstMusic.src;

            return () => {
                if (document.head.contains(preloadLink)) {
                    document.head.removeChild(preloadLink);
                }
            };
        }
    }, [topMusics]);

    return <section className={styles.section}>

        <IndexTrends trendsInfo={trends} />

        <PopularArtists />

        <div className={styles.content}>
            <IndexTopChart musics={topMusics} />
            <IndexArtits artists={topArtists} />
        </div>
        
    </section>
}

export default Index;