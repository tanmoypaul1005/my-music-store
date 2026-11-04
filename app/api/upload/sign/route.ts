import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { COVERS_FOLDER, SONGS_FOLDER, signUpload } from '@/services/server/cloudinary'
import { isSection } from '@/services/sections'

const isAllowed = (password: string) => {
    const secret = process.env.UPLOAD_PASSWORD || ''
    const a = Buffer.from(password)
    const b = Buffer.from(secret)
    return secret.length > 0 && a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}))
    if (!isAllowed(String(body.password || ''))) {
        return NextResponse.json({ error: 'Wrong upload password' }, { status: 401 })
    }

    try {
        if (body.kind === 'cover') return NextResponse.json(signUpload(COVERS_FOLDER))

        const title = String(body.title || '').trim()
        const artist = String(body.artist || '').trim()
        if (!title || !artist) return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 })

        if (body.section && !isSection(body.section)) return NextResponse.json({ error: 'Unknown section' }, { status: 400 })

        const cover = typeof body.cover === 'string' && body.cover.startsWith('https://res.cloudinary.com/') ? body.cover : undefined
        return NextResponse.json(signUpload(SONGS_FOLDER, { title, artist, cover, section: body.section || undefined }))
    } catch (e) {
        console.error('Upload sign:', (e as Error).message)
        return NextResponse.json({ error: 'Upload is not configured on the server' }, { status: 500 })
    }
}
