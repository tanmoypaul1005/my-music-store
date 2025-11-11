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

    return <>
    {
        pathName?.includes('/video') ? null : (
            <div className={styles.player}>
            <PlayerControl music={music} />
            <PlayerInfo
                image={music ? music.avatar : logo}
                imageAlt={music ? music.name : "not found"}
                name={music ? music.name : "Not found any music selected"}
                artist={music ? music.artist : "No One..."}
                musicId={music ? music.id : null}
            />
        </div>
        )
    }
        
    </>
}

export default Player;