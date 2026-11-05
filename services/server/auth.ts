import { timingSafeEqual } from 'crypto'

// Same password protects uploading and editing songs
export const isAllowed = (password: string) => {
    const secret = process.env.UPLOAD_PASSWORD || ''
    const a = Buffer.from(password)
    const b = Buffer.from(secret)
    return secret.length > 0 && a.length === b.length && timingSafeEqual(a, b)
}
