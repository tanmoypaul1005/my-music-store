"use client"
import { useAppStore } from "@/store/app-store";

import MainCard from "@/components/ui/main-card/MainCard";
import IndexTopChartItem from "./IndexTopChartItem";

import styles from './IndexTopChart.module.scss'

const PLAY_LIST_ID = "top-charts-musics-playlist"

const IndexTopChart = ({
    musics,
    preset = "default", // Add preset parameter
} : {
    musics: Music[];
    preset?: "default" | "preset2"; // Add preset type
}) => {
    const [setMusic, setPlayList, playlistId] = useAppStore(state => [state.setMusic, state.setPlaylist, state.playListId])

    const playMusicClickHandler = (type: "play" | "remove" = "play", music: Music) => {
        setMusic(music)
        if ( playlistId !== PLAY_LIST_ID ) {
            setPlayList(PLAY_LIST_ID, musics)
        }
    }

    return (
        <MainCard 
            title="Top Charts"
            link="/musics"
            text="See all"
        >
            <ul className={styles.list}>
            {
                    musics.map((music, index) => (
                        <IndexTopChartItem 
                            key={music.id} 
                            musicData={music} 
                            index={index+1} 
                            onMusicClick={playMusicClickHandler}
                            preset={preset} // Pass preset to child component
                        />
                    ))
                }
            </ul>
        </MainCard>
    )
}

export default IndexTopChart;