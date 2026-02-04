"use client";
import Link from "next/link";
import styles from "./PopularArtists.module.scss";
import  banglaSong  from "@/server/banglaSong.json";

interface PopularArtistsProps {
  songs: Music[];
  banglaSongs?: Music[];
  topArtists?: Artist[];
}

export default function PopularArtists({ songs, banglaSongs = [], topArtists = [] }: PopularArtistsProps) {
  // Merge all songs
  const allSongs = [...songs, ...banglaSongs];
  
  // Also get songs from topArtists
  const topArtistsSongs: Music[] = [];
  topArtists.forEach(artist => {
    topArtistsSongs.push(...artist.musics);
  });
  
  // Merge all songs together
  const mergedSongs = [...allSongs, ...topArtistsSongs];
  
    // Merge all songs together
  const mergedSongs2 = [...banglaSong?.music];

  console.log("Total merged songs:", banglaSong?.music);

  // Extract unique artists from songs
  const artistMap = new Map<string, { name: string; avatar: string; songCount: number }>();
  
  mergedSongs.forEach(song => {
    if (artistMap.has(song.artist)) {
      const artist = artistMap.get(song.artist)!;
      artist.songCount++;
    } else {
      artistMap.set(song.artist, {
        name: song.artist,
        avatar: song.avatar,
        songCount: 1
      });
    }
  });

  const artists = Array.from(artistMap.values())
    .sort((a, b) => b.songCount - a.songCount)
    .slice(0, 6); // Show top 6 artists
  
  console.log("Final unique artists:", artists.length);
  console.log("Artists:", artists);

  return (
    <div className={styles.popularArtists}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular artists</h2>
        <Link href="/artists" className={styles.showAll}>
          Show all
        </Link>
      </div>

      <div className={styles.artistsGrid}>
        {mergedSongs2.map((artist, index) => (
          <Link
            key={index}
            href={`/artist/${encodeURIComponent(artist.name)}`}
            className={styles.artistCard}
          >
            <div className={styles.avatarWrapper}>
              <img
                src={artist.avatar}
                alt={artist.name}
                className={styles.avatar}
              />
            </div>
            <h3 className={styles.artistName}>{artist.name}</h3>
            <p className={styles.artistLabel}>Artist</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
