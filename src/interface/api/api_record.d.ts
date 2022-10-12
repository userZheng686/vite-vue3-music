export interface RecentSongItem {
    playTime: number;
    resourceId: number;
    resourceType: string;
    data: {
        name: string;
        ar: Array<{
            id: number;
            name: string;
            tns: string[];
            alias: string[];
        }>;
        h: {
            br: number;
        };
        alia: string[];
        mv: number;
        publishTime: number;
        tns: string[];
        id: number;
    };
    author: string;
}

export interface RecentSong {
    code: number;
    data: {
        list: RecentSongItem[];
        total: number;
    }
}