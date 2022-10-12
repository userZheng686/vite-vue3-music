import { SongDetailSongsItem } from 'i/api/api_song.d';

export interface PersonalFM {
    code: number;
    data: SongDetailSongsItem[]
}

export interface Trash {
    addTime: number;
    code: number;
    count: number;
    currsize: number;
    data: SongDetailSongsItem[];
}