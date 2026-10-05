import fetchWithFallback from "../fetchWithFallback"

const GetMusics = async () => {
    const data : Music[] = await fetchWithFallback<Music[]>(process.env.NEXT_PUBLIC_MUSICS_API, 'musics')


    return data
}

export default GetMusics;