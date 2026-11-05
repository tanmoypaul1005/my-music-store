import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { SONGS_FOLDER, UpdateSong } from '@/services/server/cloudinary'
import { isSection } from '@/services/sections'
import { isAllowed } from '@/services/server/auth'

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}))
    if (!isAllowed(String(body.password || ''))) {
        return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    const publicId = String(body.publicId || '')
    const title = String(body.title || '').trim()
    const artist = String(body.artist || '').trim()
    // Only songs uploaded from the app can be edited
    if (!publicId.startsWith(SONGS_FOLDER + '/') || publicId.includes('..')) {
        return NextResponse.json({ error: 'Invalid song' }, { status: 400 })
    }
    if (!title || !artist) return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 })
    if (body.section !== undefined && body.section !== '' && !isSection(body.section)) {
        return NextResponse.json({ error: 'Unknown section' }, { status: 400 })
    }

    // New cover must already be uploaded to our Cloudinary account
    const cover = typeof body.cover === 'string' && body.cover.startsWith('https://res.cloudinary.com/') && !/[|=]/.test(body.cover) ? body.cover : undefined

    try {
        await UpdateSong(publicId, { title, artist, cover, section: body.section })
        revalidatePath('/', 'layout')
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('Update song:', (e as Error).message)
        return NextResponse.json({ error: (e as Error).message }, { status: 500 })
    }
}
