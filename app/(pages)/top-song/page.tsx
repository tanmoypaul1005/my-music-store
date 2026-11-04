import MusicList from "@/components/music/MusicList";
import { GetSectionMusics } from "@/services/server/cloudinary";

import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Top Song',
  description: 'Top Song',
}

const MusicsPage = async () => {
  const musics = await GetSectionMusics("top");

  return <MusicList name="Top song" musics={musics} playListId="top-song-playlist" />;
};

export default MusicsPage;
