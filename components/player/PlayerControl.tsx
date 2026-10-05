/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Dropdown, message } from 'antd';
import useFormatSecond from '@/hooks/use-format-second';

import Icon from '../ui/Icon';

import styles from './PlayerControl.module.scss'

const PlayerControl = ({
    music,
}: {
    music: Music | null,
}) => {
    const [currentTime, setCurrentTime, isPlaying, setIsPlaying, volume, setVolume, changeMusic, repeatType, setRepeat, disableKeydown, playList] = useAppStore(state => [state.currentMusicTime, state.setCurrentMusicTime, state.isPlaying, state.setPlayingState, state.volume, state.setVolume, state.changeMusic, state.repeatType, state.setRepeatType, state.disableKeyDown, state.playList])
    const [duration, setDuration] = useState<number>(null)
    const [repeatOnce, setRepeatOnce] = useState<boolean>(false)
    const ref = useRef<HTMLAudioElement>()

    const [messageApi, contextHolder] = message.useMessage()

    // Once the current song is buffered, ask the service worker to cache it
    // and the next one (never competes with the song the user is waiting on)
    const cacheForOffline = () => {
        const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker?.controller : null;
        if (!sw || !music) return;
        const srcs = music.src.startsWith('/') ? [music.src] : [];
        if (playList && playList.length > 0) {
            const currentIndex = playList.findIndex(m => m.id === music.id);
            const next = playList[currentIndex + 1 < playList.length ? currentIndex + 1 : 0];
            if (next && next.src !== music.src && next.src.startsWith('/')) srcs.push(next.src);
        }
        if (srcs.length) sw.postMessage({ type: 'CACHE_AUDIO', urls: srcs });
    };

    const changeVolumeHandler = (volumeValue: number) => {
        ref.current.volume = volumeValue
        setVolume(volumeValue)
    }

    const menuItems = [
        {
            key: "1",
            label: (
                <div style={{ height: "150px", padding: "10px 0" }}>
                    <input
                        aria-label="Volume"
                        className={styles.volumeSlider}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(event) => changeVolumeHandler(Number(event.target.value))}
                    />
                </div>
            )
        }
    ]

    const formatedDuration = useFormatSecond(duration)

    useEffect(() => {
        const handler = (e: KeyboardEventInit) => {
            // Do not hijack keys while the user is typing (e.g. in the search box)
            const target = (e as KeyboardEvent).target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return

            const keyPressedCode: string = e.code ? e.code.toLowerCase() : ""

            const event = e as any;
            if (!["f5", "keyr", "keyj"].includes(keyPressedCode)) event.preventDefault();

            if (keyPressedCode === "space") {
                if (isPlaying) {
                    setIsPlaying(false)
                } else {
                    setIsPlaying(true)
                }
            } else if (keyPressedCode === "arrowleft") {
                const newCurrentTime = currentTime - 5

                if (newCurrentTime < 0) {
                    changeMusic("prev")
                } else {
                    ref.current.currentTime = newCurrentTime
                    setCurrentTime(newCurrentTime)
                }
            } else if (keyPressedCode === "arrowright") {
                const newCurrentTime = currentTime + 5

                if (newCurrentTime > duration) {
                    changeMusic("next", true)
                } else {
                    ref.current.currentTime = newCurrentTime
                    setCurrentTime(newCurrentTime)
                }
            } else if (keyPressedCode === "arrowup") {
                const newVal = volume + 0.2 > 1 ? 1 : volume + 0.2
                ref.current.volume = newVal
                setVolume(newVal)
            } else if (keyPressedCode === "arrowdown") {
                const newVal = volume - 0.2 < 0 ? 0 : volume - 0.2
                ref.current.volume = newVal
                setVolume(newVal)
            }
        }

        if (!disableKeydown) {
            document.addEventListener("keydown", handler)
        }

        return () => {
            document.removeEventListener("keydown", handler)
        }
    }, [isPlaying, currentTime, volume, disableKeydown])

    useEffect(() => {
        if (music) {
            const audio = ref.current;
            audio.src = music.src;
            audio.currentTime = currentTime;
            audio.volume = volume;
            
            // Load the audio metadata immediately
            audio.load();
            
            if (isPlaying) {
                // Use canplay event to ensure smooth playback
                const playWhenReady = () => {
                    audio.play().catch(err => console.error('Playback error:', err));
                };
                
                if (audio.readyState >= 3) {
                    // Audio is already loaded enough to play
                    audio.play().catch(err => console.error('Playback error:', err));
                } else {
                    // Wait for audio to be ready
                    audio.addEventListener('canplay', playWhenReady, { once: true });
                }
            } else {
                audio.pause();
            }
        }
    }, [music, isPlaying]);

    const musicTimeUpdateHandler = () => {
        if (ref?.current?.currentTime === duration) changeMusic("next", true)
        else setCurrentTime(ref.current.currentTime)
    }

    const playClickHandler = () => {
        if (music) {
            if (!isPlaying) setIsPlaying(true)
            else setIsPlaying(false)
        }
    }

    const musicTimeChangeHandler = (time: number) => {
        ref.current.currentTime = time
        setCurrentTime(time); // Update the state to ref
    }

    const metadataLoadHandler = () => {
        setDuration(ref.current.duration)
    }

    const repeatClickHandler = () => {
        if (repeatType === "shuffle") {
            messageApi.open({
                type: "error",
                content: "You must turn off shuffle repeat"
            })
            return
        }

        let content: string = "Repeat Musics turned off"
        if (repeatOnce === null) {
            setRepeat("all")
            setRepeatOnce(false)
            content = "Repeat all Musics turned on"
        } else if (repeatOnce) {
            setRepeat("off")
            setRepeatOnce(null)
        } else {
            setRepeat("once")
            setRepeatOnce(true)
            content = "Repeat one Music turned on"
        }

        messageApi.open({
            type: "success",
            content
        })
    }

    const shuffleRepeatClickHandler = () => {
        let content: string = "Suffle repeat truned on"
        if (repeatType === "shuffle") {
            if (repeatOnce === null) {
                setRepeat("off")
                content = "Repeat Musics turned off"
            } else if (repeatOnce) {
                setRepeat("once")
                content = "Repeat one Music turned on"
            } else {
                setRepeat("all")
                content = "Repeat all Musics turned on"
            }
        } else {
            setRepeat("shuffle")
        }

        messageApi.open({
            type: "success",
            content
        })
    }

    const previousMusicClickHandler = () => {
        if (currentTime < 3) {
            changeMusic("prev")
        } else {
            ref.current.currentTime = 0
            setCurrentTime(0)
        }
    }

    const nextMusicClickHandler = () => changeMusic("next", false)

    return <div className={styles['control-wrapper']}>
        <div className={styles.control}>
            <div className={styles.button} onClick={repeatClickHandler}>
                <Icon className={`${styles.icon} ${repeatType !== "shuffle" && repeatType !== "off" ? styles.active : ""}`} icon={repeatOnce !== null && repeatOnce ? "repeat-once" : "repeat"} />
            </div>
            <div className={styles.button} onClick={previousMusicClickHandler}>
                <Icon className={styles.icon} icon="previous-fill" />
            </div>
            <div className={`${styles.button} ${styles.main}`} onClick={playClickHandler}>
                <Icon className={styles.icon} icon={isPlaying ? "pause-fill" : "play-fill"} />
            </div>
            <div className={styles.button} onClick={nextMusicClickHandler}>
                <Icon className={styles.icon} icon="next-fill" />
            </div>
            <div className={styles.button} onClick={shuffleRepeatClickHandler}>
                <Icon className={`${styles.icon} ${repeatType === "shuffle" ? styles.active : ""}`} icon="shuffle-arrows" />
            </div>
        </div>

        <div className={styles.audio}>
            {
                music
                && <audio 
                    ref={ref} 
                    onTimeUpdate={musicTimeUpdateHandler} 
                    onLoadedMetadata={metadataLoadHandler}
                    preload="auto"
                    onCanPlayThrough={cacheForOffline}
                >
                    Your browser does not support the audio element.
                </audio>
            }
            <div className={styles['slider-wrapper']}>
                <span className={`${styles.time} ${styles.current}`}>{useFormatSecond(currentTime)}</span>
                <input
                    aria-label="Song progress"
                    className={styles.progressSlider}
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    disabled={!duration}
                    onChange={(event) => musicTimeChangeHandler(Number(event.target.value))}
                />
                <span className={styles.time}>{formatedDuration ? formatedDuration : "00:00"}</span>

                <Dropdown placement='top' menu={{ items: menuItems }}>
                    <span className={styles.button}>
                        <Icon className={styles.icon} icon={volume === 0 ? "volume-mute-fill" : volume <= 0.65 ? "volume-1-fill" : "volume-max-fill"} />
                    </span>
                </Dropdown>
            </div>
        </div>
        {contextHolder}
    </div>
}

export default PlayerControl;
