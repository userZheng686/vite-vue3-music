import { Subscribers } from './api_radio.d';
import { SongDetailSongsItem } from './api_song.d'
export interface EliteSongMenuItem {
    name: string;
    creator: CreatorType;
    coverImgUrl: string;
    tag: string;
    id: number;
    copywriter: string;
    playCount: number;
    updateTime: number;
}

export interface EliteSongMenu {
    code: number;
    lasttime: number;
    more: boolean;
    playlists: Array<EliteSongMenuItem>;
    total: number;
}

export interface HotSongMenuItem {
    id: number;
    name: string;
}

export interface HotSongMenu {
    code: number;
    tags: Array<HotSongMenuItem>
}

export interface CreatorType {
    //用户名
    nickname: string;
    //头像
    avatarUrl: string;
    //用户id
    userId: number;
    //是否关注
    followed: boolean;
}

export interface FriendEliteSongMenuItem {
    id: number;
    name: string;
    playCount: number;
    creator: CreatorType;
    coverImgUrl: string;
}

export interface FriendEliteSongMenu {
    cat: string;
    code: number;
    more: boolean;
    total: number;
    playlists: Array<FriendEliteSongMenuItem>;
}

export interface IntelligencePlay {
    code : number;
    data : Array<{
        alg : string;
        id : number;
        songInfo : SongDetailSongsItem;
    }>
}

export interface EliteSongMenuTagItem {
    id: number;
    name: string;
}

export interface EliteSongMenuTag {
    code: number;
    tags: Array<EliteSongMenuTagItem>
}

export interface SearchResultItem {
    id: number;
    name: string;
    playCount: number;
    creator: CreatorType;
    coverImgUrl: string;
}

export interface SearchResult {
    code: number;
    result: {
        playlistCount: number;
        playlists: SearchResultItem[];
        songs: SongDetailSongsItem[];
        searchQcReminder: null;
    }
}


export interface UserSongMenu {
    code: number;
    more: boolean;
    playlist: playlist[]
}

export interface UserRecord {
    code : number;
    weekData ?: Array<{
        playCount : number;
        score : number;
        song : SongDetailSongsItem;
    }>;
    allData ?: Array<{
        playCount : number;
        score : number;
        song : SongDetailSongsItem;
    }>;
}

export interface RecommendSongMenuPersonalizedItem {
    picUrl: string;
    playCount: number;
    name: string;
    id: number;
}

export interface RecommendSongMenuPersonalized {
    code: number;
    featureFirst: boolean;
    haveRcmdSongs: boolean;
    recommend: Array<RecommendSongMenuPersonalizedItem>;
}

export interface PrivateContentItem {
    id: number;
    picUrl: string;
    name: string;
    type : number;
}

export interface PrivateContent {
    category: number;
    code: number;
    hasTaste: boolean;
    result: PrivateContentItem[]
}

//歌单详情
export interface playlist {
    id: number;
    name: string;
    coverImgUrl: string;
    createTime: number;
    subscribedCount: number;
    shareCount: number;
    playCount: number;
    tracks ?: Array<SongDetailSongsItem>;
    trackIds ?: Array<{
        id: number;
        ratio: number;
        lr: number;
    }>;
    creator: CreatorType;
    privacy: number;
    cloudTrackCount : number;
    trackCount: number;
    subscribed: boolean;
    commentCount: number;
    tags?: string[];
    description: string;
    specialType: number;
    userId: number;
}


export interface userSongMenu {
    code: number;
    id: number;
    playlist: playlist;

}

export interface SongMenuDetail {
    code: number;
    playlist: playlist;
    privileges: Array<{
        id: number;
        plLevel : string;
    }>;
    relatedVideos: null;
    resEntrance: null;
    sharedPrivilege: null;
    urls: null;
}

export interface SongMenuCategoryItem {
    category: number;
    name: string;
    playlist: playlist;
}

export interface SongMenuCategory {
    code: number;
    sub: SongMenuCategoryItem[];
    categories: {
        [propname: string]: string
    }
}

export interface EditSongMenuCategoryItem {
    id: number;
    name: string;
    category: number;
}

export interface EditSongMenuCategory {
    categories: {
        [propname: string]: string
    };
    code: number;
    tags: Array<EditSongMenuCategoryItem>;
}

export interface SongToSongMenu {
    status: number;
    body: {
        cloudCount: number;
        code: number;
        count: number;
        coverImgId: string;
        coverImgUrl: string;
        trackIds: string;
    };
}

export interface RadarListItme {
    creativeId: number;
    uiElement: {
        mainTitle: {
            title: string;
        };
        images: [
            {
                imageUrl: string;
            }
        ];
    };
    resources: [
        {
            resourceId: number;
            resourceExtInfo: {
                commentCount: number;
                playCount: number;
                users: Array<{
                    description: string;
                    avatarUrl: string;
                    nickname: string;
                    userId: number;
                    followed: boolean;
                }>
            };
        }
    ]
}

export interface RadarList {
    code: number;
    data: {
        blocks: Array<{
            creatives: RadarListItme[];
            uiElement: {
                mainTitle: {
                    title: string;
                },
                subTitles: Array<{
                    title: string
                }>
            };
            extInfo: string | null;
        }>
    }
}

export interface RecommendSongs {
    code: number;
    data: {
        dailySongs: SongDetailSongsItem[];
        orderSongs: SongDetailSongsItem[]
    };
    recommend: SongDetailSongsItem[];
}

export interface SongListItem {
    coverImgUrl: string;
    cloudTrackCount: number;
    privacy: number;
    userId: number;
    creator: CreatorType;
    trackCount: number;
    id: number;
    name: string;
    playCount: number;
    subscribed: boolean;
}

export interface SongList {
    code: number;
    playlists: SongListItem[]
}

export interface DislikePlaylist {
    code: number;
    result: Array<{
        alg: string;
        canDislike: boolean;
        id: number;
        name: string;
        picUrl: string;
    }>

}

export interface PreviewPlaylist {
    code : number;
    playlist : playlist
}