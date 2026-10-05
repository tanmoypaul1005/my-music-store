import db from '@/server/db.json'

type DbKey = 'musics' | 'artists' | 'trends' | 'top-artists' | 'top-musics'

/**
 * Fetch JSON from the remote API; if it is down or returns a non-JSON/error
 * response, fall back to the bundled local copy in server/db.json.
 */
const fetchWithFallback = async <T>(url: string, key: DbKey): Promise<T> => {
    try {
        const res = await fetch(url)
        if (res.ok && (res.headers.get('content-type') || '').includes('json')) {
            return await res.json()
        }
    } catch {}
    return (db as Record<string, unknown>)[key] as T
}

export default fetchWithFallback
