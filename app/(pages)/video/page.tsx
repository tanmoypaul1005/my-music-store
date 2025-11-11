"use client"
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import Icon from '@/components/ui/Icon';
import styles from './video.module.scss';

// Sample video data - replace with your actual video data
const videoData = [
    {
        id: 1,
        title: "Amazing Music Video 2024",
        artist: "The Weeknd",
        thumbnail: "https://img.youtube.com/vi/LXb3EKWsInQ/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        views: "1.2M",
        uploadDate: "2 days ago",
        description: "Official music video for the latest hit single from The Weeknd"
    },
    {
        id: 2,
        title: "Blinding Lights",
        artist: "The Weeknd",
        thumbnail: "https://img.youtube.com/vi/4NRXx6U8ABQ/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        views: "2.5M",
        uploadDate: "1 week ago",
        description: "The iconic 80s-inspired hit from After Hours album"
    },
    {
        id: 3,
        title: "Save Your Tears",
        artist: "The Weeknd",
        thumbnail: "https://img.youtube.com/vi/XXYlFuWEuKI/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=XXYlFuWEuKI",
        views: "3.1M",
        uploadDate: "2 weeks ago",
        description: "Save Your Tears official music video"
    },
    {
        id: 4,
        title: "Starboy",
        artist: "The Weeknd ft. Daft Punk",
        thumbnail: "https://img.youtube.com/vi/34Na4j8AVgA/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=34Na4j8AVgA",
        views: "4.2M",
        uploadDate: "1 month ago",
        description: "Starboy featuring Daft Punk from the album Starboy"
    },
    {
        id: 5,
        title: "Die For You",
        artist: "The Weeknd",
        thumbnail: "https://img.youtube.com/vi/qFLhGq0060w/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=qFLhGq0060w",
        views: "1.8M",
        uploadDate: "3 days ago",
        description: "Die For You - A heartfelt ballad from The Weeknd"
    },
    {
        id: 6,
        title: "I Feel It Coming",
        artist: "The Weeknd ft. Daft Punk",
        thumbnail: "https://img.youtube.com/vi/qFLhGq0060w/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=qFLhGq0060w",
        views: "2.9M",
        uploadDate: "5 days ago",
        description: "I Feel It Coming - Collaboration with Daft Punk"
    }
];

const Video = () => {
    
    const [currentVideo, setCurrentVideo] = useState(videoData[0]);

    const handleVideoSelect = (video: typeof videoData[0]) => {
        setCurrentVideo(video);
    };


    const suggestedVideos = videoData.filter(video => video.id !== currentVideo.id);

    return (
        <div className={styles.videoPage}>  
        
            <div className={styles.mainContent}>
                <div className={styles.playerContainer}>
                    <div className={styles.playerWrapper}>
                        <ReactPlayer
                            key={currentVideo.id}
                            src={currentVideo.url}
                            width="100%"
                            height="100%"
                            className={styles.reactPlayer}
                            controls={true}
                        />
                    </div>

                    {/* Video Info */}
                    <div className={styles.videoInfo}>
                        <h1 className={styles.videoTitle}>{currentVideo.title}</h1>
                        <div className={styles.videoMeta}>
                            <div className={styles.channelInfo}>
                                <div className={styles.channelAvatar}>
                                    <Icon icon="user" />
                                </div>
                                <div className={styles.channelDetails}>
                                    <h3 className={styles.channelName}>{currentVideo.artist}</h3>
                                    <span className={styles.views}>{currentVideo.views} views • {currentVideo.uploadDate}</span>
                                </div>
                            </div>
                            {/* <div className={styles.actions}>
                                <button className={styles.actionBtn}>
                                    <Icon icon="heart" />
                                    <span>Like</span>
                                </button>
                                <button className={styles.actionBtn}>
                                    <Icon icon="forward" />
                                    <span>Share</span>
                                </button>
                                <button className={styles.actionBtn}>
                                    <Icon icon="cloud-download" />
                                    <span>Download</span>
                                </button>
                            </div> */}
                        </div>
                        <div className={styles.description}>
                            <p>{currentVideo.description}</p>
                        </div>
                    </div>
                </div>

                {/* Suggested Videos Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Up Next</h2>
                        <button className={styles.autoplayToggle}>
                            <span>Autoplay</span>
                            <div className={styles.toggle}>
                                <input type="checkbox" id="autoplay" defaultChecked />
                                <label htmlFor="autoplay"></label>
                            </div>
                        </button>
                    </div>

                    <div className={styles.videoList}>
                        {suggestedVideos.map((video) => (
                            <div
                                key={video.id}
                                className={styles.videoCard}
                                onClick={() => handleVideoSelect(video)}
                            >
                                <div className={styles.thumbnailContainer}>
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className={styles.thumbnail}
                                    />
                                    {/* <span className={styles.videoDuration}>{video.duration}</span> */}
                                </div>
                                <div className={styles.videoDetails}>
                                    <h3 className={styles.videoCardTitle}>{video.title}</h3>
                                    <p className={styles.videoCardArtist}>{video.artist}</p>
                                    <div className={styles.videoCardMeta}>
                                        <span>{video.views} views</span>
                                        <span>•</span>
                                        <span>{video.uploadDate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;