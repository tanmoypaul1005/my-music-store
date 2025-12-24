"use client"
import React from 'react';
import Image from 'next/image';
import Icon from '../ui/Icon';
import styles from './BanglaSongCard.module.scss';

interface BanglaSongCardProps {
    musicData: Music;
    index: number;
    onMusicClick: (type: "play" | "remove", music: Music) => void;
}

const BanglaSongCard: React.FC<BanglaSongCardProps> = ({ musicData, index, onMusicClick }) => {
    return (
        <div className={styles.card} onClick={() => onMusicClick("play", musicData)}>
            <div className={styles.imageWrapper}>
                <Image
                    src={musicData.avatar}
                    alt={musicData.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.overlay}>
                    <div className={styles.playButton}>
                        <Icon className={styles.playIcon} icon="play-fill" />
                    </div>
                </div>
                <div className={styles.index}>{index}</div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{musicData.name}</h3>
                <p className={styles.artist}>{musicData.artist}</p>
            </div>
        </div>
    );
};

export default BanglaSongCard;
