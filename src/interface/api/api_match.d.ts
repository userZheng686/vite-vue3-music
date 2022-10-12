//歌曲类型
import { SongDetailSongsItem } from './api_song.d'

export interface MatchSong {
    code: number;
    data: {
        type: number;
        result: Array<{
            songTime: number;
            song: MatchSongItem
        }>
    };
    message: string
}

export interface MatchSongItem extends SongDetailSongsItem {
    album: {
        id: number;
        name: string;
        picUrl: string;
        transName: string[];
    };
    alias: string[];
    artists: Array<{
        alias: string[];
        id: number;
        name: string;
        trans: string[];
    }>;
}