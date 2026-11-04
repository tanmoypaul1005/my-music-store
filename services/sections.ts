// Sections an uploaded song can be added to (shared by the upload form and the server)
export const SECTIONS = {
    'bangla': 'Top Bangla Songs',
    'popular-bangla': 'Popular Bangla Songs',
    'hindi': 'Hindi Songs',
    'top': 'Top Songs',
} as const

export type Section = keyof typeof SECTIONS

export const isSection = (value: unknown): value is Section =>
    typeof value === 'string' && Object.prototype.hasOwnProperty.call(SECTIONS, value)
