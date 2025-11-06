"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Mousewheel, EffectFade } from 'swiper/modules';
import { useAppStore } from '@/store/app-store';
import IndexTrendsSlide from './IndexTrendsSlide';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import styles from './IndexTrends.module.scss'

const PLAY_LIST_ID = "top-music-trends-playlist"

const IndexTrends = ({

}: {
    trendsInfo: Music[]
}) => {

    const trendsInfo = [
        {
            "id": 120,
            "name": "LEVEL FIVE - TUMI",
            "src": "/musics/bangla/LEVEL FIVE - TUMI.mp3",
            "artist": "Jayati Chakraborty",
            "coverImage": "/images/music/cover.webp",
            "avatar": "/images/music/without-me.webp",
            "playedCount": 63000000
        },
        {
            "id": 121,
            "name": "Without Me",
            "src": "/musics/trends/without me.mp3",
            "artist": "Halsey",
            "coverImage": "/images/music/cover.webp",
            "avatar": "/images/music/without-me.webp",
            "playedCount": 63000000
        },
        {
            "id": 122,
            "name": "7 rings",
            "src": "/musics/trends/7 rings.mp3",
            "artist": "Ariana Grande",
            "coverImage": "/images/music/cover-2.webp",
            "avatar": "/images/music/7-rings.webp",
            "playedCount": 73000000
        },
        {
            "id": 123,
            "name": "Only Human",
            "src": "/musics/trends/only human.mp3",
            "artist": "Jonas Brothers",
            "coverImage": "/images/music/cover-3.webp",
            "avatar": "/images/music/only-human.webp",
            "playedCount": 25000000
        },
        {
            "id": 124,
            "name": "Attention",
            "src": "/musics/trends/attention.mp3",
            "artist": "Charlie Puth",
            "coverImage": "/images/music/cover-4.webp",
            "avatar": "/images/music/attention.webp",
            "playedCount": 110000000
        }
    ]

    const [music, setMusic, setPlaylist, playlistId] = useAppStore(state => [state.currentMusic, state.setMusic, state.setPlaylist, state.playListId])

    const playMusicClickHandler = (music: Music) => {
        setMusic(music)
        if (playlistId !== PLAY_LIST_ID) {
            setPlaylist(PLAY_LIST_ID, trendsInfo)
        }
    }

    console.log('trendsInfo', trendsInfo)

    return (
        <Swiper
            className={`${styles.slider} trend-slider`}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
                delay: 8000,
                disableOnInteraction: false,
            }}
            effect={'fade'}
            pagination={{
                clickable: true,
            }}
            direction={'vertical'}
            navigation={true}
            mousewheel={true}
            modules={[Autoplay, Pagination, Navigation, Mousewheel, EffectFade]}
        >
            {
                trendsInfo.map(trendInfo => (
                    <SwiperSlide key={trendInfo.id}>
                        <IndexTrendsSlide key={trendInfo.id} music={music} trendInfo={trendInfo} onMusicClick={playMusicClickHandler}></IndexTrendsSlide>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
}

export default IndexTrends