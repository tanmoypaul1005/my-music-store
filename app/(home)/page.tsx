import GetTrends from "@/services/server/trends/GetTrends"
import { GetSongs, pickSection } from "@/services/server/cloudinary"
import { EXTRA_HOME_SECTIONS, SECTIONS } from "@/services/sections"

import Index from "@/components/index/Index"

const HomePage = async () => {
    const [trends, songs] = await Promise.all([GetTrends(), GetSongs()])

    const sections = {
        bangla: pickSection(songs, "bangla"),
        popularBangla: pickSection(songs, "popular-bangla"),
        hindi: pickSection(songs, "hindi"),
        top: pickSection(songs, "top"),
        extra: EXTRA_HOME_SECTIONS.map(key => ({ key, title: SECTIONS[key], musics: pickSection(songs, key) })),
    }

    return <Index trends={trends} sections={sections} />
}

export default HomePage;
