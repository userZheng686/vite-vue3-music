import { Banner } from "./api_other.d";
import { Radio } from "./api_radio.d";
import { SongDetailSongsItem } from "./api_song.d";
import { RecommendMV } from './api_video.d'

export interface HomeBatch {
    '/api/mlivestream/entrance/audio': {
        code: number;
        data: {
            data: Array<{
                bgCoverUrl: string;
                coverTag: string;
                cover: string;
                startStreamTagName: string;
                liveUrl: {
                    hlsPullUrl: string;
                    httpPullUrl: string;
                    rtmpPullUrl: string;
                }
                title: string;
                userInfo: {
                    avatarUrl: string;
                    nickname: string;
                    liveRoomNo: number;
                    userId: number;
                };
                recLiveDTO: {
                    skipUrl: string;
                };
                popularity: number;
            }>
        }
    };
    '/api/personalized/djradio': {
        code: number;
        result: Array<{
            copywriter: string;
            id: number;
            name: string;
            picUrl: string;
            radio: Radio;
        }>
    };
    '/api/personalized/mv': RecommendMV;
    '/api/personalized/newsong': {
        code: number;
        result: Array<{
            id: number;
            name: string;
            picUrl: string;
            song: SongDetailSongsItem;
            alg: string;
        }>
    };
    '/api/personalized/playlist': {
        code: number;
        result: Array<{
            id: number;
            name: string;
            picUrl: string;
            playCount: number;
            trackCount: number;
        }>
    };
    '/api/personalized/privatecontent': {
        code: number;
        result: Array<{
            copywriter: string;
            id: number;
            name: string;
            picUrl: string;
        }>
    };
    '/api/recommend/live/get': {
        code: number;
        data: Array<{
            avatarUrl: string;
            liveCoverUrl: string;
            liveTitle: string;
            nickname: string;
            popularity: number;
            userId: number;
            webRoomUrl: string;
        }>
    };
    '/api/v2/banner/get': Banner
}