"use client";
import Link from "next/link";
import styles from "./PopularArtists.module.scss";
import  banglaSong  from "@/server/banglaSong.json";
import  populerBanglaSong  from "@/server/populerBanglaSong.json";


export default function PopularArtists({  }) {
  
  // Merge all songs together
  const allSongs = [...banglaSong?.music, ...populerBanglaSong?.music];
  
  // Extract unique artists with song count
  const artistMap = new Map<string, { name: string; avatar: string; songCount: number }>();
  
  allSongs.forEach(song => {
    const artistName = song.artist;
    if (artistMap.has(artistName)) {
      const artist = artistMap.get(artistName)!;
      artist.songCount++;
    } else {
      artistMap.set(artistName, {
        name: artistName,
        avatar: song.avatar,
        songCount: 1
      });
    }
  });

  // Convert to array and sort by song count
  const uniqueArtists = Array.from(artistMap.values())
    .sort((a, b) => b.songCount - a.songCount)
    .slice(0, 6); // Show top 6 artists

  return (
    <div className={styles.popularArtists}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular artists</h2>
        {/* <Link href="/artists" className={styles.showAll}>
          Show all
        </Link> */}
      </div>

      <div className={styles.artistsGrid}>
        {uniqueArtists?.map((artist, index) => (
          <Link
            key={index}
            href={`/artist/${encodeURIComponent(artist.name)}`}
            className={styles.artistCard}
          >
            <div className={styles.avatarWrapper}>
              <img
                src={artist?.avatar}
                alt={artist?.name}
                className={styles.avatar}
              />
            </div>
            <h3 className={styles.artistName}>{artist?.name}</h3>
            <p className={styles.artistLabel}>Artist</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
