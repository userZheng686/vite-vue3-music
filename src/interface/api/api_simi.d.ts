
export interface Playlists {
    id: number;
    coverImgUrl: string;
    name: string;
}


export interface SimiPlayList {
    code: number;
    playlists: Playlists[]
}

export interface SongItem {
    alias: string[];
    name: string;
    artists: Array<{
        name: string;
        id: number;
    }>;
    id: number;
    album: {
        blurPicUrl: string;
    };
    transNames: string[];
}

export interface SimiSong {
    code: number;
    songs: SongItem[]
}

export interface SimiArtistItem {
    name : string;
    picUrl: string;
    id : number;
    accountId : number;
}

export interface SimiArtist{
    artists : SimiArtistItem[];
    code : number;
}