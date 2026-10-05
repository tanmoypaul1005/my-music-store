import fetchWithFallback from "../fetchWithFallback"

const GetTopArtists = async () => {
    const data : Artist[] = await fetchWithFallback<Artist[]>(process.env.NEXT_PUBLIC_TOP_ARTISTS_API, 'top-artists')


    return data;
}

export default GetTopArtists;