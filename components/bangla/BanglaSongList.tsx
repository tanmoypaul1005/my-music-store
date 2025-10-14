"use client";
import { useAppStore } from "@/store/app-store";
import React from "react";
import banglaMusics from "@/server/banglaSong.json";
import IndexTopChartItem from "../index/top-chart/IndexTopChartItem";
import styles from "./banglaSong.module.scss";

const BanglaSongList = () => {
  const musics = banglaMusics?.music;

  const PLAY_LIST_ID = "top-charts-musics-playlist";

  const [setMusic, setPlayList, playlistId] = useAppStore((state) => [
    state.setMusic,
    state.setPlaylist,
    state.playListId,
  ]);

  const playMusicClickHandler = (
    type: "play" | "remove" = "play",
    music: Music
  ) => {
    setMusic(music);
    if (playlistId !== PLAY_LIST_ID) {
      setPlayList(PLAY_LIST_ID, musics);
    }
  };

  return (
    <div>
      <div 
      className={styles.title}
      style={{
        marginBottom: "20px",
        flex: 1,
        display: "flex",
      }}>Top Bangla song</div>
      <ul style={{
          marginBottom: "40px",
      }} className={styles.list}>
        {musics.map((music, index) => (
          <IndexTopChartItem
            key={music.id}
            musicData={music}
            index={index + 1}
            onMusicClick={playMusicClickHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default BanglaSongList;
