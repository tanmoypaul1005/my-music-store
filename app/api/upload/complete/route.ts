import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Called after a successful upload so every page showing uploads (uploads, sections, home) refreshes immediately
export async function POST() {
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
}
