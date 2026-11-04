import GetTrends from "@/services/server/trends/GetTrends"
import GetUploadedMusics, { withUploads } from "@/services/server/cloudinary"
import banglaSong from "@/server/banglaSong.json"
import populerBanglaSong from "@/server/populerBanglaSong.json"
import hindiSong from "@/server/hindiSong.json"
import topSong from "@/server/topSong.json"

import Index from "@/components/index/Index"

const HomePage = async () => {
    const [trends, uploads] = await Promise.all([GetTrends(), GetUploadedMusics()])

    const sections = {
        bangla: withUploads("bangla", banglaSong.music, uploads),
        popularBangla: withUploads("popular-bangla", populerBanglaSong.music, uploads),
        hindi: withUploads("hindi", hindiSong.music, uploads),
        top: withUploads("top", topSong.music, uploads),
    }

    return <Index trends={trends} sections={sections} />
}

export default HomePage;
