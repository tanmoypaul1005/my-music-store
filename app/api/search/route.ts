import { NextRequest, NextResponse } from 'next/server'

const AUDIUS = 'https://api.audius.co/v1'
const APP_NAME = 'my-music-store'
const FALLBACK_COVER = '/images/not-found-music.webp'

// Audius ids are strings (e.g. "blQ8b"); the app's Music.id is a number
const hashId = (id: string) => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
    return Math.abs(h) + 1000000
}

export async function GET(req: NextRequest) {
    const q = (req.nextUrl.searchParams.get('q') || '').trim()
    if (q.length < 2) return NextResponse.json({ results: [] })

    try {
        const res = await fetch(
            `${AUDIUS}/tracks/search?query=${encodeURIComponent(q)}&limit=24&app_name=${APP_NAME}`,
            { next: { revalidate: 300 } }
        )
        if (!res.ok) throw new Error(`Audius ${res.status}`)
        const json = await res.json()

        const results = (json.data || [])
            .filter((t: any) => t.is_streamable !== false && !t.is_delete && !t.is_unlisted)
            .map((t: any) => {
                const cover = t.artwork?.['480x480'] || t.artwork?.['150x150'] || FALLBACK_COVER
                const music: Music = {
                    id: hashId(t.id),
                    name: t.title,
                    src: `${AUDIUS}/tracks/${t.id}/stream?app_name=${APP_NAME}`,
                    coverImage: cover,
                    avatar: t.artwork?.['150x150'] || cover,
                    artist: t.user?.name || 'Unknown',
                    playedCount: t.play_count || 0,
                }
                return { music, duration: t.duration || 0 }
            })

        return NextResponse.json({ results })
    } catch {
        return NextResponse.json({ results: [], error: 'Search is unavailable right now' }, { status: 502 })
    }
}
