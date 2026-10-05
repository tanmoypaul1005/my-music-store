import fetchWithFallback from "../fetchWithFallback"

const GetTrends = async () => {
    const data : Music[] = await fetchWithFallback<Music[]>(process.env.NEXT_PUBLIC_TRENDS_API, 'trends')


    return data;
}

export default GetTrends;