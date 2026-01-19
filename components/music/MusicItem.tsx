"use client"
import Image from 'next/image'
import useAudioDuration from '@/hooks/use-audio-duration'
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

    const { output, durationSeconds, formatedDuration } = useAudioDuration(musicData.src)

    return <li className={styles.item}>
        <div className={styles.fixed}>
            {output}
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
            <h5 className={styles.title}>{musicData?.name}</h5>
            <span className={styles.text}>{musicData?.artist}</span>
            {durationSeconds ? (
                <span className={styles.duration}>
                    {formatedDuration}
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