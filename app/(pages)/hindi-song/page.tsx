import MusicList from "@/components/music/MusicList";
import { GetSectionMusics } from "@/services/server/cloudinary";

const MusicsPage = async () => {
  const musics = await GetSectionMusics("hindi");

  return <MusicList name="Top hindi song" musics={musics} playListId="hindi-song-playlist" />;
};

export default MusicsPage;
