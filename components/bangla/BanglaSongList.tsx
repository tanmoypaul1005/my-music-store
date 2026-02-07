"use client";
import { useAppStore } from "@/store/app-store";
import banglaMusics from "@/server/banglaSong.json";
import populerBanglaSong from "@/server/populerBanglaSong.json";
import IndexTopChartItem from "../index/top-chart/IndexTopChartItem";
import BanglaSongCard from "./BanglaSongCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./banglaSong.module.scss";
import topSong from "@/server/topSong.json";
import PopularArtists from "../index/popular-artists/PopularArtists";

const BanglaSongList = () => {

  const musics = banglaMusics?.music;
  const populermusics = populerBanglaSong?.music;

  const PLAY_LIST_ID = "top-charts-musics-playlist";

  const [setMusic, setPlayList, playlistId] = useAppStore((state) => [
    state.setMusic,
    state.setPlaylist,
    state.playListId,
  ]);

  const playMusicClickHandler = (
    type: "play" | "remove" = "play",
    music: Music
  ) => {
    setMusic(music);
    if (playlistId !== PLAY_LIST_ID) {
      setPlayList(PLAY_LIST_ID, musics);
    }
  };

  return (
    <div>
      <div
        className={styles.title}
        style={{
          marginBottom: "20px",
          flex: 1,
          display: "flex",
        }}>Top Bangla song</div>
      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Mousewheel]}
          spaceBetween={20}
          slidesPerView="auto"
          navigation
          mousewheel={{ forceToAxis: true }}
          className={styles.cardSwiper}
        >
          {musics.map((music, index) => (
            <SwiperSlide key={music.id} className={styles.slide}>
              <BanglaSongCard
                musicData={music}
                index={index + 1}
                onMusicClick={playMusicClickHandler}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className={styles.title}
        style={{
          marginBottom: "0px",
          flex: 1,
          display: "flex",
        }}>Popular Bangla Songs</div>
      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Mousewheel]}
          spaceBetween={20}
          slidesPerView="auto"
          navigation
          mousewheel={{ forceToAxis: true }}
          className={styles.cardSwiper}
        >
          {populermusics.map((music, index) => (
            <SwiperSlide key={music.id} className={styles.slide}>
              <BanglaSongCard
                musicData={music}
                index={index + 1}
                onMusicClick={playMusicClickHandler}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <PopularArtists />

      <div
        className={styles.title}
        style={{
          marginBottom: "20px",
          marginTop: "40px",
          flex: 1,
          display: "flex",
          fontSize: "22px",
          fontWeight: "800",
        }}>Top song</div>

      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Mousewheel]}
          spaceBetween={20}
          slidesPerView="auto"
          navigation
          mousewheel={{ forceToAxis: true }}
          className={styles.cardSwiper}
        >
          {topSong?.music?.map((music, index) => (
            <SwiperSlide key={music.id} className={styles.slide}>
              <BanglaSongCard
                musicData={music}
                index={index + 1}
                onMusicClick={playMusicClickHandler}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};

export default BanglaSongList;
