import GetTrends from "@/services/server/trends/GetTrends"
import GetMusics from "@/services/server/musics/GetMusics"

import Index from "@/components/index/Index"

const HomePage = async () => {
    const trends = await GetTrends()

    return <Index trends={trends} />
}

export default HomePage;