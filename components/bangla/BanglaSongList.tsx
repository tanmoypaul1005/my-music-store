"use client";
import { useAppStore } from "@/store/app-store";
import BanglaSongCard from "./BanglaSongCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "./banglaSong.module.scss";
import PopularArtists from "../index/popular-artists/PopularArtists";

// Each list already includes songs uploaded to that section
export type HomeSections = {
  bangla: Music[];
  popularBangla: Music[];
  hindi: Music[];
  top: Music[];
  extra: { key: string; title: string; musics: Music[] }[];
};

const BanglaSongList = ({ sections }: { sections: HomeSections }) => {

  const musics = sections.bangla;
  const populermusics = sections.popularBangla;

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
          marginBottom: "20px",
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

      <PopularArtists songs={[...musics, ...populermusics]} />

      <div
        className={styles.title}
        style={{
          marginBottom: "20px",
          marginTop: "40px",
          flex: 1,
          display: "flex",
          fontSize: "22px",
          fontWeight: "800",
        }}>Hindi song</div>

      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Mousewheel]}
          spaceBetween={20}
          slidesPerView="auto"
          navigation
          mousewheel={{ forceToAxis: true }}
          className={styles.cardSwiper}
        >
          {sections.hindi.map((music, index) => (
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
          {sections.top.map((music, index) => (
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

      {sections.extra.filter(s => s.musics.length > 0).map(section => (
        <div key={section.key}>
          <div
            className={styles.title}
            style={{
              marginBottom: "20px",
              marginTop: "40px",
              flex: 1,
              display: "flex",
              fontSize: "22px",
              fontWeight: "800",
            }}>{section.title}</div>

          <div className={styles.sliderContainer}>
            <Swiper
              modules={[Navigation, Mousewheel]}
              spaceBetween={20}
              slidesPerView="auto"
              navigation
              mousewheel={{ forceToAxis: true }}
              className={styles.cardSwiper}
            >
              {section.musics.map((music, index) => (
                <SwiperSlide key={music.id} className={styles.slide}>
                  <BanglaSongCard
                    musicData={music}
                    index={index + 1}
                    onMusicClick={() => {
                      setMusic(music);
                      const id = `${section.key}-home-playlist`;
                      if (playlistId !== id) setPlayList(id, section.musics);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ))}

    </div>
  );
};

export default BanglaSongList;
