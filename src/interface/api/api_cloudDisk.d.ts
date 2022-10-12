//歌曲类型接口声明
import { SongDetailSongsItem } from './api_song.d'

export interface UserCloudDataItem {
    songName: string;
    songId: number;
    addTime: number;
    album: string;
    fileSize: number;
    artist: string;
    fileName: string;
    simpleSong: SongDetailSongsItem;
}

export interface UserCloud {
    code: number;
    count: number;
    hasMore: boolean;
    maxSize: string;
    size: string;
    upgradeSign: number;
    data: UserCloudDataItem[];
}