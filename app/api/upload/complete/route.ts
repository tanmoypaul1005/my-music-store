import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Called after a successful upload so the /uploads list refreshes immediately
export async function POST() {
    revalidatePath('/uploads')
    return NextResponse.json({ ok: true })
}
