"use client"
import { useEffect, useState } from 'react'
import Image from '@/components/ui/SafeImage'
import { useAppStore } from '@/store/app-store'
import styles from './Search.module.scss'
import itemStyles from '@/components/music/MusicItem.module.scss'
import listStyles from '@/components/music/MusicList.module.scss'

type Result = { music: Music, duration: number }

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

const Search = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Result[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [setMusic, setPlaylist, currentMusic] = useAppStore(state => [state.setMusic, state.setPlaylist, state.currentMusic])

    useEffect(() => {
        const q = query.trim()
        if (q.length < 2) {
            setResults([])
            setError('')
            return
        }
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            setLoading(true)
            setError('')
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
                const json = await res.json()
                setResults(json.results || [])
                if (json.error) setError(json.error)
            } catch (e) {
                if ((e as Error).name !== 'AbortError') setError('Search is unavailable right now')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }, 400)
        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [query])

    const play = (music: Music) => {
        setPlaylist(`search-${query.trim()}`, results.map(r => r.music))
        setMusic(music)
    }

    return <div className={styles.wrapper}>
        <input
            className={styles.input}
            type="search"
            autoFocus
            placeholder="Search songs or artists..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
        {loading && <p className={styles.hint}>Searching...</p>}
        {error && <p className={styles.hint}>{error}</p>}
        {!loading && !error && query.trim().length >= 2 && results.length === 0 && <p className={styles.hint}>No songs found</p>}
        <ul className={listStyles.list}>
            {results.map(({ music, duration }) => (
                <li key={music.id} className={itemStyles.item} onClick={() => play(music)}>
                    <Image
                        className={itemStyles.img}
                        src={music.avatar}
                        width={160}
                        height={160}
                        loading="lazy"
                        alt={`${music.name} cover image`}
                        style={{ objectFit: 'cover', outline: currentMusic?.id === music.id ? '2px solid var(--primary-color)' : undefined }}
                    />
                    <h5 className={itemStyles.title}>{music.name}</h5>
                    <span className={itemStyles.text}>{music.artist}</span>
                    <span className={itemStyles.duration}>{formatTime(duration)}</span>
                </li>
            ))}
        </ul>
    </div>
}

export default Search
