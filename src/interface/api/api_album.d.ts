import { ArtistItem } from "./api_artist.d";
import { SongDetailSongsItem } from 'i/api/api_song.d';

export interface TopAlbumItem {
    blurPicUrl: string;
    author: string;
    name: string;
    alias: string[];
    artists: Array<{
        alias: string[];
        name: string;
        id : number;
    }>;
    id : number;
}

export interface TopAlbum {
    code: number;
    hasMore: boolean;
    monthData: Array<TopAlbumItem>;
    weekData: Array<TopAlbumItem>;
}

export interface CollectSubListItem {
    alias: string[];
    artists: Array<ArtistItem>;
    id: number;
    msg: string[];
    name: string;
    picUrl: string;
    size: number;
    subTime: number;
    transNames: string[];
}

export interface CollectSubList {
    code: number;
    count: number;
    data: CollectSubListItem[];
    hasMore: boolean;
    paidCount: number;
}

export interface AlbumDynamic {
    code: number;
    commentCount: number;
    isSub: boolean;
    likedCount: number;
    onSale: boolean;
    shareCount: number;
    subCount: number;
    subTime: number;
}

export interface Album {
    blurPicUrl: string;
    picUrl : string;
    commentThreadId: string;
    description: string;
    id: number;
    name: string;
    publishTime: number;
    size: number;
    alias : string[];
    isSub : boolean;
    artists: Array<{
        id: number;
        name: string;
        picUrl: string;
        followed: boolean;
        trans: string;
    }>;
    artist: {
        id: number;
        name: string;
        picUrl: string;
        followed: boolean;
        trans: string;
        alias : string[];
    }
}

export interface AlbumPriviledge {
    album: Album;
    code: number;
    songs: SongDetailSongsItem[]
}

export interface ArtistAlbumItem {
    id: number;
    name: string;
    picUrl: string;
    publishTime: number;
    alias: string[];
    size: number;
    isSub : boolean;
}

export interface ArtistAlbum {
    code: number;
    hotAlbums: ArtistAlbumItem[];
    more: boolean;
}

export interface ArtistAlbumSongs {
    code: number;
    songs: SongDetailSongsItem[];
    info: {
        commentCount: number;
        likedCount: number;
        resourceType: number;
        shareCount: number;
    };
    album: Album
}