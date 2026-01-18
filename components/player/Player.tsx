"use client"
import { useAppStore } from '@/store/app-store';
import PlayerInfo from './PlayerInfo';
import PlayerControl from './PlayerControl';
import styles from './Player.module.scss'
import { logo } from '@/public/images';
import { usePathname } from 'next/navigation';

const Player = () => {

    const pathName = usePathname();

    const music = useAppStore(state => state.currentMusic)

    // Don't render player if on video page OR if no music is selected
    if (pathName?.includes('/video') || !music) {
        return null;
    }

    return (
        <div className={styles.player}>
            <PlayerControl music={music} />
            <PlayerInfo
                image={music.avatar}
                imageAlt={music.name}
                name={music.name}
                artist={music.artist}
                musicId={music.id}
            />
        </div>
    )
}

export default Player;

