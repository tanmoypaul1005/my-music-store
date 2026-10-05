import fetchWithFallback from "../fetchWithFallback"

const GetTopMusics = async () => {
    const data : Music[] = await fetchWithFallback<Music[]>(process.env.NEXT_PUBLIC_TOP_MUSICS_API, 'top-musics');


    return data;
}

export default GetTopMusics;