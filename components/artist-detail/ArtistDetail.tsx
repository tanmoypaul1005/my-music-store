"use client";

import { useAppStore } from "@/store/app-store";
import MusicItem from "@/components/music/MusicItem";
import styles from "./ArtistDetail.module.scss";

interface ArtistDetailProps {
  artist: string;
  songs: Music[];
}

export default function ArtistDetail({ artist, songs }: ArtistDetailProps) {
  const { setMusic, setPlaylist } = useAppStore();

  const musicClickHandler = (music: Music) => {
    setMusic(music);
    setPlaylist(`${artist}-artist-playlist`, songs);
  };

  if (!songs || songs.length === 0) {
    return (
      <div className={styles.noSongs}>
        <h2>No songs found for {artist}</h2>
        <p>This artist doesn&apos;t have any songs in our collection yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.artistDetail}>
      <div className={styles.header}>
        <img 
          src={songs[0]?.avatar || '/images/default-artist.png'} 
          alt={artist}
          className={styles.artistAvatar}
        />
        <div className={styles.artistInfo}>
          <h1 className={styles.artistName}>{artist}</h1>
          <p className={styles.songCount}>{songs.length} টি গান</p>
        </div>
      </div>

      <div className={styles.songsList}>
        {songs.map((song) => (
          <MusicItem
            key={song.id}
            musicData={song}
            onMusicClick={() => musicClickHandler(song)}
          />
        ))}
      </div>
    </div>
  );
}
