"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import styles from './UploadForm.module.scss'

const MAX_AUDIO_MB = 50
const MAX_COVER_MB = 5

type Signed = { signature: string, api_key: string, cloudName: string, timestamp: string, folder: string, context?: string }

const getSignature = async (body: object): Promise<Signed> => {
    const res = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Could not start upload')
    return json
}

// XHR instead of fetch so we get upload progress events
const uploadToCloudinary = (file: File, signed: Signed, resourceType: 'video' | 'image', onProgress?: (p: number) => void) =>
    new Promise<{ secure_url: string }>((resolve, reject) => {
        const form = new FormData()
        form.append('file', file)
        form.append('api_key', signed.api_key)
        form.append('timestamp', signed.timestamp)
        form.append('signature', signed.signature)
        form.append('folder', signed.folder)
        if (signed.context) form.append('context', signed.context)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`)
        xhr.upload.onprogress = e => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100))
        xhr.onload = () => {
            const json = JSON.parse(xhr.responseText || '{}')
            xhr.status < 300 ? resolve(json) : reject(new Error(json.error?.message || 'Upload failed'))
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(form)
    })

const UploadForm = () => {
    const router = useRouter()
    const setDisableKeyDown = useAppStore(state => state.setDisableKeyDown)
    const [title, setTitle] = useState('')
    const [artist, setArtist] = useState('')
    const [password, setPassword] = useState('')
    const [audio, setAudio] = useState<File | null>(null)
    const [cover, setCover] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const validate = () => {
        if (!audio) return 'Choose an audio file'
        if (!audio.type.startsWith('audio/')) return 'Only audio files are allowed'
        if (audio.size > MAX_AUDIO_MB * 1024 * 1024) return `Audio must be under ${MAX_AUDIO_MB}MB`
        if (cover && !cover.type.startsWith('image/')) return 'Cover must be an image'
        if (cover && cover.size > MAX_COVER_MB * 1024 * 1024) return `Cover must be under ${MAX_COVER_MB}MB`
        return ''
    }

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        const invalid = validate()
        if (invalid) {
            setStatus('error')
            setMessage(invalid)
            return
        }
        setStatus('uploading')
        setMessage('')
        setProgress(0)
        try {
            let coverUrl: string | undefined
            if (cover) {
                setMessage('Uploading cover...')
                coverUrl = (await uploadToCloudinary(cover, await getSignature({ password, kind: 'cover' }), 'image')).secure_url
            }
            setMessage('Uploading song...')
            const signed = await getSignature({ password, kind: 'audio', title, artist, cover: coverUrl })
            await uploadToCloudinary(audio!, signed, 'video', setProgress)
            await fetch('/api/upload/complete', { method: 'POST' })

            setStatus('done')
            setMessage(`"${title}" uploaded`)
            setTitle('')
            setArtist('')
            setAudio(null)
            setCover(null)
            ;(e.target as HTMLFormElement).reset()
            router.refresh()
        } catch (err) {
            setStatus('error')
            setMessage((err as Error).message)
        }
    }

    const uploading = status === 'uploading'
    const inputProps = { onFocus: () => setDisableKeyDown(true), onBlur: () => setDisableKeyDown(false), disabled: uploading }

    return <form className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
            <input className={styles.input} placeholder="Song title" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required {...inputProps} />
            <input className={styles.input} placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} maxLength={120} required {...inputProps} />
        </div>
        <div className={styles.row}>
            <label className={styles.file}>
                <span>Audio file (mp3, max {MAX_AUDIO_MB}MB)</span>
                <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files?.[0] || null)} required disabled={uploading} />
            </label>
            <label className={styles.file}>
                <span>Cover image (optional)</span>
                <input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] || null)} disabled={uploading} />
            </label>
        </div>
        <div className={styles.row}>
            <input className={styles.input} type="password" placeholder="Upload password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" {...inputProps} />
            <button className={styles.button} type="submit" disabled={uploading}>
                {uploading ? `Uploading ${progress}%` : 'Upload'}
            </button>
        </div>
        {uploading && <div className={styles.progress}><div style={{ width: `${progress}%` }} /></div>}
        {message && <p className={status === 'error' ? styles.error : styles.hint}>{message}</p>}
    </form>
}

export default UploadForm
