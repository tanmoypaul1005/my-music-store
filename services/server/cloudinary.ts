import { createHash } from 'crypto'
import { Section } from '@/services/sections'

// Every song lives in Cloudinary under ROOT_FOLDER; its info (title, artist, cover, sections...) is the asset's context
const ROOT_FOLDER = 'my-music-store/'
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
export const signUpload = (folder: string, meta?: { title: string, artist: string, cover?: string, section?: Section }) => {
    const { cloudName, apiKey, apiSecret } = config()
    const params: Record<string, string> = {
        folder,
        timestamp: String(Math.round(Date.now() / 1000)),
    }
    if (meta) {
        params.context = [`title=${clean(meta.title)}`, `artist=${clean(meta.artist)}`, meta.cover && `cover=${meta.cover}`, meta.section && `sections=${meta.section}`]
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

type Song = Music & {
    uploaded: boolean,          // added from the Uploads page
    createdAt: number,
    // section -> position in that section; null = uploaded later, shown before positioned songs
    positions: Partial<Record<Section, number | null>>,
}

// "bangla:0,popular-bangla:3,hindi" -> { bangla: 0, 'popular-bangla': 3, hindi: null }
const parseSections = (value = '') => Object.fromEntries(
    value.split(',').filter(Boolean).map(entry => {
        const [section, position] = entry.split(':')
        return [section, position === undefined ? null : Number(position)]
    })
)

const toSong = (r: any): Song => {
    const ctx = r.context?.custom || {}
    const cover = ctx.cover || FALLBACK_COVER
    return {
        id: ctx.id ? Number(ctx.id) : hashId(r.public_id),
        name: ctx.title || r.public_id.split('/').pop(),
        src: r.secure_url,
        coverImage: cover,
        avatar: cover,
        artist: ctx.artist || 'Unknown',
        playedCount: Number(ctx.plays) || 0,
        uploaded: r.public_id.startsWith(SONGS_FOLDER + '/'),
        createdAt: Date.parse(r.created_at) || 0,
        positions: parseSections(ctx.sections),
    }
}

const GetSongs = async (): Promise<Song[]> => {
    try {
        const { cloudName, apiKey, apiSecret } = config()
        const songs: Song[] = []
        let cursor = ''
        do {
            // Audio files live under resource_type "video" in Cloudinary
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/resources/video/upload?prefix=${encodeURIComponent(ROOT_FOLDER)}&context=true&max_results=500${cursor ? `&next_cursor=${cursor}` : ''}`,
                {
                    headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
                    next: { revalidate: 300 },
                }
            )
            if (!res.ok) throw new Error(`Cloudinary ${res.status}`)
            const json = await res.json()
            songs.push(...(json.resources || []).map(toSong))
            cursor = json.next_cursor || ''
        } while (cursor)
        return songs
    } catch (e) {
        console.error('GetSongs:', (e as Error).message)
        return []
    }
}

const toMusic = ({ uploaded, createdAt, positions, ...music }: Song): Music => music

// Newly uploaded songs first (newest first), then the section's songs in their saved order
export const pickSection = (songs: Song[], section: Section): Music[] => songs
    .filter(s => section in s.positions)
    .sort((a, b) => {
        const pa = a.positions[section], pb = b.positions[section]
        if (pa == null && pb == null) return b.createdAt - a.createdAt
        if (pa == null) return -1
        if (pb == null) return 1
        return pa - pb
    })
    .map(toMusic)

export const GetAllMusics = async () => (await GetSongs()).map(toMusic)

export const GetSectionMusics = async (section: Section) => pickSection(await GetSongs(), section)

// Songs added from the Uploads page, newest first
const GetUploadedMusics = async () => (await GetSongs())
    .filter(s => s.uploaded)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(toMusic)

export { GetSongs }
export default GetUploadedMusics
