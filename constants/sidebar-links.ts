export const SidebarLinks : SidebarLinkInfo[] = [
    {
        id: 401,
        title: "MENU",
        links: [
            {
                id: 501,
                title: "Explore",
                href: "/",
                icon: "voice",
                child: false,
            },
            {
                id: 502,
                title: "Top Songs",
                href: "/top-song",
                icon: "playlist",
                child: true,
            },
            {
                id: 503,
                title: "Musics",
                href: "/musics",
                icon: "category",
                child: true,
            },
            {
                id: 504,
                title: "Artists",
                href: "/artists",
                icon: "setting",
                child: true,
            }
        ]
    },
     {
        id: 402,
        title: "LIBRARY",
        links: [
            {
                id: 506,
                title: "Bangla Songs",
                href: "/bangla-song",
                icon: "playlist",
                child: true,
            },
            {
                id: 507,
                title: "Hindi Songs",
                href: "/hindi-song",
                icon: "music-note-fill",
                child: true,
            },
            {
                id: 508,
                title: "Video Songs",
                href: "/video",
                icon: "camera",
                child: true,
            },
            // {
            //     id: 509,
            //     title: "Profile",
            //     href: "/profile",
            //     icon: "user",
            //     child: true,
            // },
        ]
    }
]