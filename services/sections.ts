// Sections an uploaded song can be added to (shared by the upload form and the server)
export const SECTIONS = {
    'bangla': 'Top Bangla Songs',
    'popular-bangla': 'Popular Bangla Songs',
    'hindi': 'Hindi Songs',
    'top': 'Top Songs',
    'bangla-romantic': 'Bangla Romantic Songs',
    'bangla-sad': 'Bangla Sad Songs',
    'bangla-folk': 'Bangla Folk Songs',
    'bangla-band': 'Bangla Band Songs',
    'bangla-old': 'Bangla Old Songs',
} as const

export type Section = keyof typeof SECTIONS

// Extra Bangla sections shown as rows on the home page (hidden while empty)
export const EXTRA_HOME_SECTIONS: Section[] = ['bangla-romantic', 'bangla-sad', 'bangla-folk', 'bangla-band', 'bangla-old']

export const isSection = (value: unknown): value is Section =>
    typeof value === 'string' && Object.prototype.hasOwnProperty.call(SECTIONS, value)
