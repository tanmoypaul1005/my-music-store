import GetTopArtists from "@/services/server/top-artists/GetTopArtists"
import GetTopMusics from "@/services/server/top-musics/GetTopMusics"
import GetTrends from "@/services/server/trends/GetTrends"
import GetMusics from "@/services/server/musics/GetMusics"

import Index from "@/components/index/Index"

const HomePage = async () => {
    const trends = await GetTrends()
    const topArtists = await GetTopArtists()
    const topMusic = await GetTopMusics()
    const allSongs = await GetMusics()

    return <Index trends={trends} topArtists={topArtists} topMusics={topMusic} allSongs={allSongs} />
}

export default HomePage;