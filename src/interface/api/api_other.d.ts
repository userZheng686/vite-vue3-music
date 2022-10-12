export interface suggest {
    type: string,
    keywords: string
}

export interface hotListSuccess {
    code: Number,
    data: Array<hotListItem>,
    message: string
}

export interface hotListItem {
    alg: string,
    content: string,
    iconType: Number
    iconUrl: null
    score: Number
    searchWord: string
    source: Number
    url: string
}

export interface BannerItem {
    imageUrl: string;
    url: string;
}

export interface Banner {
    code: number;
    banners: Array<BannerItem>
}
