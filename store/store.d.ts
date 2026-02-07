interface authStoreState {
    token: string,
    id: number,
    setInitialAuth: (token: string, id: number) => void,
 
}

interface ThemeStoreState {
    darkMode: boolean,
    setInitialDarkMode: (dark: boolean) => void,
    toggleDarkMode: () => void,
}

interface AppStoreState {
    currentMusic: Music,
    isPlaying: boolean,
    volume: number,
    playList: Music[],
    playListModalOpen: boolean,
    musicClicked: Music,
    playListId: string,
    currentMusicTime: number,
    repeatType: RepeatType,
    shuffleIndex: number[],
    disableKeyDown: boolean,
    setPlayListModal: (type: boolean) => void,
    setMusicClicked: (music: Music) => void,
    setDisableKeyDown: (disabled: boolean) => void,
    setInitialApp: (payload: AppLocalStorage) => void,
    // firstOpen: boolean,
    setRepeatType: (type: RepeatType) => void,
    setMusic: (music: Music) => void,
    setPlayingState: (status: boolean) => void,
    changeMusic: (type: ChangeMusicType,auto?: boolean) => void
    // nextMusic: (type: ChangeMusicType,auto?: boolean) => void,
    // prevMusic: () => void,
    setVolume: (newVal: number) => void,
    setPlaylist: (id: string, musics: Music[]) => void,
    setPlayListId: (id: string) => void,
    // changeFirstOpen: () => void,
    setCurrentMusicTime: (time: number) => void,
}

interface UserStoreState {
    playLists: PlayList[]
}

interface BaseInfo {
    id: number,
    creationDate: number,
    modificationDate?: number,
}

interface UserInfo extends BaseInfo {
    userName: string,
    password: string,
    email: string,
    profileImage?: string,
    birthDate: number,
}

interface StoreResponse<T> {
    status: number,
    statusText: string,
    data?: T
}

type ChangeMusicType = "next" | "prev"

type ChangePlayListMusicType = "add" | "remove"

type RepeatType = "off" | "once" | "shuffle" | "all"

type AppLocalStorageType = "currentMusic" | "playlist" | "playListId" | "currentMusicTime" | "volume" | "repeat" | "shuffle"

type AppLocalStoragePayload =
| { type: "currentMusic"; music: Music }
| { type: "playlist"; playlist: Music[], id: string }
| { type: "isPlaying"; isPlaying: boolean }
| { type: "currentMusicTime"; time: number }
| { type: "volume"; volume: number }
| { type: "repeat"; repeatType: RepeatType }
| { type: "shuffle"; array: number[]};