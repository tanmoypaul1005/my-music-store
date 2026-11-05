"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { SECTIONS } from '@/services/sections'
import type { EditableSong } from '@/services/server/cloudinary'
import styles from './EditSongs.module.scss'

const MAX_COVER_MB = 5

// Sign with the server, then upload the image straight to Cloudinary
const uploadCover = async (file: File, password: string) => {
    const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, kind: 'cover' }),
    })
    const signed = await signRes.json()
    if (!signRes.ok) throw new Error(signed.error || 'Could not upload cover')

    const form = new FormData()
    form.append('file', file)
    form.append('api_key', signed.api_key)
    form.append('timestamp', signed.timestamp)
    form.append('signature', signed.signature)
    form.append('folder', signed.folder)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: 'POST', body: form })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Cover upload failed')
    return json.secure_url as string
}

// "bangla:0,hindi" -> "bangla"; songs in several sections show "multiple" until changed
const sectionOf = (sections: string) => {
    const keys = sections.split(',').filter(Boolean).map(s => s.split(':')[0])
    return keys.length > 1 ? 'multiple' : keys[0] || ''
}

const Row = ({ song, password }: { song: EditableSong, password: string }) => {
    const router = useRouter()
    const setDisableKeyDown = useAppStore(state => state.setDisableKeyDown)
    const initialSection = sectionOf(song.sections)
    const [title, setTitle] = useState(song.title)
    const [artist, setArtist] = useState(song.artist)
    const [section, setSection] = useState(initialSection)
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [state, setState] = useState<{ status: 'idle' | 'saving' | 'saved' | 'error', message?: string }>({ status: 'idle' })

    const preview = useMemo(() => coverFile ? URL.createObjectURL(coverFile) : '', [coverFile])
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const pickCover = (file: File | null) => {
        if (file && !file.type.startsWith('image/')) return setState({ status: 'error', message: 'Cover must be an image' })
        if (file && file.size > MAX_COVER_MB * 1024 * 1024) return setState({ status: 'error', message: `Cover must be under ${MAX_COVER_MB}MB` })
        setState({ status: 'idle' })
        setCoverFile(file)
    }

    const dirty = !!coverFile || title !== song.title || artist !== song.artist || section !== initialSection
    const saving = state.status === 'saving'
    const keyProps = { onFocus: () => setDisableKeyDown(true), onBlur: () => setDisableKeyDown(false) }

    const save = async () => {
        if (!password) return setState({ status: 'error', message: 'Enter the password above' })
        setState({ status: 'saving' })
        try {
            const cover = coverFile ? await uploadCover(coverFile, password) : undefined
            const res = await fetch('/api/songs/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password, publicId: song.publicId, title, artist, cover,
                    // Only send section when it changed, so multi-section songs keep their positions
                    section: section !== initialSection ? section : undefined,
                }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Save failed')
            setState({ status: 'saved', message: 'Saved' })
            router.refresh()
        } catch (e) {
            setState({ status: 'error', message: (e as Error).message })
        }
    }

    return <li className={styles.item}>
        <label className={styles.coverPicker} title="Change cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cover} src={preview || song.cover} alt="" />
            <span className={styles.coverHint}>Change</span>
            <input type="file" accept="image/*" hidden disabled={saving} onChange={e => pickCover(e.target.files?.[0] || null)} />
        </label>
        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} maxLength={120} placeholder="Title" disabled={saving} {...keyProps} />
        <input className={styles.input} value={artist} onChange={e => setArtist(e.target.value)} maxLength={120} placeholder="Artist" disabled={saving} {...keyProps} />
        <select className={styles.input} value={section} onChange={e => setSection(e.target.value)} disabled={saving}>
            <option value="">Uploads only</option>
            {initialSection === 'multiple' && <option value="multiple" disabled>Multiple sections</option>}
            {Object.entries(SECTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <button className={styles.button} onClick={save} disabled={!dirty || saving || section === 'multiple'}>
            {saving ? 'Saving...' : 'Save'}
        </button>
        {state.message && <span className={state.status === 'error' ? styles.error : styles.ok}>{state.message}</span>}
    </li>
}

const EditSongs = ({ songs }: { songs: EditableSong[] }) => {
    const setDisableKeyDown = useAppStore(state => state.setDisableKeyDown)
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [query, setQuery] = useState('')

    if (!songs.length) return null
    const q = query.trim().toLowerCase()
    const shown = q ? songs.filter(s => `${s.title} ${s.artist}`.toLowerCase().includes(q)) : songs

    return <div className={styles.wrapper}>
        <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
            {open ? 'Close editor' : `Edit songs (${songs.length})`}
        </button>
        {open && <>
            <div className={styles.toolbar}>
                <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" onFocus={() => setDisableKeyDown(true)} onBlur={() => setDisableKeyDown(false)} />
                <input className={styles.input} placeholder="Search title or artist" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setDisableKeyDown(true)} onBlur={() => setDisableKeyDown(false)} />
            </div>
            <ul className={styles.list}>
                {shown.map(song => <Row key={`${song.publicId}-${song.sections}-${song.title}-${song.artist}-${song.cover}`} song={song} password={password} />)}
            </ul>
        </>}
    </div>
}

export default EditSongs
