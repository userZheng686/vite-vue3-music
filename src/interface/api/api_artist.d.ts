//列表类型
import { SongDetailSongsItem } from 'i/api/api_song';
export interface ArtistItem {
    name: string;
    img1v1Url: string;
    id: number;
    accountId?: number;
    alias: string[];
    followed : boolean;
}

export interface Artist {
    code: number;
    more: boolean;
    artists: Array<ArtistItem>
}

export interface ArtistSubListItem {
    name: string;
    img1v1Url: string;
    id: number;
    albumSize: number;
    mvSize: number;
    picUrl: string;
    alias: string[];
}

export interface ArtistSubList {
    code: number;
    count: number;
    data: Array<ArtistSubListItem>;
    hasMore: boolean;
}

export interface ArtistDetail {
    artist: {
        albumSize: number;
        alias: string[];
        accountId : number;
        img1v1Url: string;
        briefDesc: string;
        picUrl: string;
        name: string;
        mvSize: number;
        musicSize: number;
        transNames: string[];
        trans: string;
        identifyTag : string[];
    };
    code: number;
    hotSongs: SongDetailSongsItem[]
}

export interface ArtistIntroductionItem {
    ti: string,
    txt: string;
}

export interface ArtistIntroduction {
    briefDesc: string;
    code: number;
    count: number;
    introduction: ArtistIntroductionItem[]
}

export interface ArtistDetailDynamic {
    code: number;
    followed: boolean;
    concert: {
        onlineCount: number;
    }
}

export interface ArtistByArtists {
    simpleConcerts: ArtistByArtistItem[];
    count: number;
    code: number;

}

export interface ArtistByArtistItem {
    simpleAddress: {
        address: string;
    };
    title: string;
    url: string;
    price: number;
    time: number[];
    cover : string;
}

export interface ArtistNewSongItem {
    sourceType : number;
    publishTime : number;
    info : {
        blockTitle : {
            artistName : string;
            artistId : number;
            imgUrl : string;
            publishDate : string;
            resourcePicUrl  : string;
            resourceName: string;
        };
        blockType : string;
        songLists : SongDetailSongsItem[];
    }
}

export interface ArtistNewSong{
    code : number;
    data : {
        hasMore : boolean;
        latestVisitTime : number;
        newWorks : ArtistNewSongItem[]
    }
}

export interface ArtistNewSongPlayall{
    code : number;
    data : {
        count : number;
        songList : SongDetailSongsItem[]
    }
}

export interface EventArtist {
    id : number;
    picUrl : string;
    name : string;
    coverImgUrl ?: string;
    title ?: string;
    webviewUrl ?: string;
}