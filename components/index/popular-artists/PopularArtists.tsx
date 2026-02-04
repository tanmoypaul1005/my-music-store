"use client";
import Link from "next/link";
import styles from "./PopularArtists.module.scss";
import  banglaSong  from "@/server/banglaSong.json";
import  populerBanglaSong  from "@/server/populerBanglaSong.json";


export default function PopularArtists({  }) {
  
  // Merge all songs together
  const mergedSongs = [...banglaSong?.music, ...populerBanglaSong?.music].flat();

  return (
    <div className={styles.popularArtists}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular artists</h2>
        <Link href="/artists" className={styles.showAll}>
          Show all
        </Link>
      </div>

      <div className={styles.artistsGrid}>
        {mergedSongs?.map((artist, index) => (
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
            <h3 className={styles.artistName}>{artist.artist}</h3>
            <p className={styles.artistLabel}>Artist</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
