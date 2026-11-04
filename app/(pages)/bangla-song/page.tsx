import MusicList from "@/components/music/MusicList";
import musicList from "@/server/banglaSong.json";
import { GetSectionMusics } from "@/services/server/cloudinary";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Bangla',
  description: 'Bangla song',
}

const MusicsPage = async () => {
  const musics = await GetSectionMusics("bangla", musicList.music);

  return <MusicList name="Top bangla song" musics={musics} playListId="bangla-song-playlist" />;
};

export default MusicsPage;
