import { createHash } from 'crypto'

export const SONGS_FOLDER = 'my-music-store/songs'
export const COVERS_FOLDER = 'my-music-store/covers'
const FALLBACK_COVER = '/images/not-found-music.webp'

const config = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary env variables are missing')
    return { cloudName, apiKey, apiSecret }
}

// Cloudinary context values use "|" and "=" as separators
const clean = (value: string) => value.replace(/[|=\\]/g, ' ').trim().slice(0, 120)

/**
 * Sign upload params so the browser can upload straight to Cloudinary
 * without ever seeing the API secret.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export const signUpload = (folder: string, meta?: { title: string, artist: string, cover?: string }) => {
    const { cloudName, apiKey, apiSecret } = config()
    const params: Record<string, string> = {
        folder,
        timestamp: String(Math.round(Date.now() / 1000)),
    }
    if (meta) {
        params.context = [`title=${clean(meta.title)}`, `artist=${clean(meta.artist)}`, meta.cover && `cover=${meta.cover}`]
            .filter(Boolean)
            .join('|')
    }
    const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
    const signature = createHash('sha1').update(toSign + apiSecret).digest('hex')

    return { ...params, signature, api_key: apiKey, cloudName }
}

// Cloudinary public ids are strings; the app's Music.id is a number
const hashId = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
    return Math.abs(h) + 2000000
}

const GetUploadedMusics = async (): Promise<Music[]> => {
    try {
        const { cloudName, apiKey, apiSecret } = config()
        // Audio files live under resource_type "video" in Cloudinary
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=${encodeURIComponent(SONGS_FOLDER)}&context=true&max_results=100`,
            {
                headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
                next: { revalidate: 300 },
            }
        )
        if (!res.ok) throw new Error(`Cloudinary ${res.status}`)
        const json = await res.json()

        return (json.resources || []).map((r: any) => {
            const ctx = r.context?.custom || {}
            const cover = ctx.cover || FALLBACK_COVER
            return {
                id: hashId(r.public_id),
                name: ctx.title || r.public_id.split('/').pop(),
                src: r.secure_url,
                coverImage: cover,
                avatar: cover,
                artist: ctx.artist || 'Unknown',
                playedCount: 0,
            }
        })
    } catch (e) {
        console.error('GetUploadedMusics:', (e as Error).message)
        return []
    }
}

export default GetUploadedMusics
