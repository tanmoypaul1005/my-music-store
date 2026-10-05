import fetchWithFallback from "../fetchWithFallback"

const GetArtists = async () => {
    const data : Artist[] = await fetchWithFallback<Artist[]>(process.env.NEXT_PUBLIC_ARTISTS_API, 'artists')


    return data
}

export default GetArtists;