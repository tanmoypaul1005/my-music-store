"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import useAudioDuration from '@/hooks/use-audio-duration'
import useFormatSecond from '@/hooks/use-format-second'
import Icon from '../ui/Icon'
import styles from './MusicItem.module.scss'

const MusicItem = ({
    musicData,
    onMusicClick,
} : {
    musicData: Music
    onMusicClick: (music: Music) => void,
}) => {
    const musicClickHandler = () => {
        onMusicClick(musicData)
    }

    const duration = useAudioDuration(musicData.src)
    const formatDuration = useFormatSecond()

    return <li className={styles.item}>
        <div className={styles.fixed}>
        </div>
        <div onClick={musicClickHandler}>
            <Image
                className={styles.img}
                src={musicData.avatar}
                width={160}
                height={160}
                loading='lazy'
                alt={`${musicData?.name} cover image`}
            />
            <h5 className={styles.title}>{musicData.name}</h5>
            <span className={styles.text}>{musicData.artist}</span>
            {duration ? (
                <span className={styles.duration}>
                    {formatDuration(duration)}
                </span>
            ) : (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingWave}>
                        <div className={styles.wave}></div>
                        <div className={styles.wave}></div>
                        <div className={styles.wave}></div>
                    </div>
                    <span className={styles.loadingText}>Loading...</span>
                </div>
            )}
        </div>
    </li>
}

export default MusicItem;