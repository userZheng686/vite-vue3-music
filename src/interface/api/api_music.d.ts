import { SongDetailSongsItem } from "./api_song";

/**这块主要用来判断是不是有sq音质*/
interface privilege {
    id: number;
    maxbr: number;
}

/**专辑类型定义 */
export interface album {
    blurPicUrl: string;
    alias: Array<string>;
    name: string;
}

export interface TopMusicItem {
    album: album;
    name: string;
    mvid: number;
    alias: Array<string>;
    artists: Array<{
        alias: string[];
        name: string;
        id: string;
    }>;

    duration: number;
    author: string;
    privilege: privilege;
    filename: string;
    blurPicUrl: string;
    transName: string;
    transNames: string[];
    isSQ: boolean;
    mp3Url: string;
    no: number;
    id: number;
}



export interface TopMusic {
    code: number;
    data: Array<TopMusicItem>
}