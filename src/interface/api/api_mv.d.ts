export interface NewMvArtists {
    id: number;
    name: string
}

export interface NewMvItem {
    artistId: number;
    artistName: string;
    artists: NewMvArtists[];
    cover: string;
    name: string;
    id: number;
    playCount: number;
    commentCount : number;
}

export interface NewMv {
    code: number;
    data: NewMvItem[];
    count: number;
    hasMore: boolean;
}

export interface TopMvItem {
    artistId: number;
}

export interface TopMvItem {
    artistId: number;
    artistName: string;
    artists : NewMvArtists[];
    cover: string;
    id: number;
    lastRank: number;
    score: number;
    name: string;
    commentCount : number;
}

export interface TopMv {
    code: number;
    data: TopMvItem[]
}

export interface MvDetailItemBrs {
    br: number
}

export interface MvDetailItemArtists {
    id: number;
    name: string;
    img1v1Url: string;
    followed: boolean;
}

export interface MvDetailItem {
    artistId: number;
    artistName: string;
    brs: MvDetailItemBrs[];
    name: string;
    artists: Array<MvDetailItemArtists>;
    commentCount: number;
    cover: string;
    desc: string;
    duration: number;
    id: number;
    playCount: number;
    publishTime: string;
    shareCount: number;
    subCount: number;

}

export interface MvDetail {
    code: number;
    data: MvDetailItem;
    subed: boolean;
}

export interface MvUrlItem {
    fee: number;
    url: string;
    r: number;
}

export interface MvUrl {
    code: number;
    data: MvUrlItem
}



export interface SimiMvItem {
    artistId: number;
    artistName: string;
    cover: string;
    duration: number;
    name: string
    playCount: number;
    id: number;
}

export interface SimiMv {
    code: number;
    mvs: SimiMvItem[]
}


export interface MvDetailInfo {
    code: number;
    commentCount: number;
    liked: boolean
    likedCount: number;
    shareCount: number;
}

export interface ArtistMVItem {
    publishTime : string;
    name : string;
    playCount : number;
    duration: number;
    subed:boolean;
    imgurl : string;
    id : number;
    commentCount: number;
}

export interface ArtistMV {
    code : number;
    hasMore : boolean;
    mvs : ArtistMVItem[]
    time: number;
}

export interface SubMV{
    code : number;
    hasMore : boolean;
    data : Array<{
        vid : string;
        name : string;
        type : number;
    }>
}

export interface MV {
    imgurl : string;
    playCount: number;
    name : string;
    artistName : string;
    width: number;
    height : number;
    id : number;
}