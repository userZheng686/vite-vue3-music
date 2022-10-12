import { SongDetailSongsItem } from './api_song.d'

export interface DJ{
    avatarUrl : string;
    city : number;
    nickname : string;
    followed : boolean;
    userId : number;
    gender : number;
}

export interface HotTypeRadioItem {
    //副类型
    secondCategory: string;
    //图片url
    picUrl: string;
    //电台id
    id: number;
    //电台名字
    name: string;
    //订阅
    subCount: number;
    //类型
    category: string;
    //备注
    rcmdtext: string;
    //声音
    programCount: number;
}

export interface HotTypeRadio {
    code: number;
    count: number;
    djRadios: Array<HotTypeRadioItem>;
    hasMore: boolean;
}

export interface SecondTypeRadio {
    code: number;
    data: {
        hasMore: boolean;
        list: Array<HotTypeRadioItem>
    }
}

export interface PersonRadioRecommendItem {
    picUrl: string;
    rcmdtext: string;
    name: string;
    id: number;
}

export interface PersonRadioRecommend {
    code: number;
    data: PersonRadioRecommendItem[]
}

export interface TypeRadioItem {
    id: number;
    name: string;
    pic56x56Url: string;
}

export interface TypeRadio {
    code: number;
    categories: TypeRadioItem[]
}

export interface RadioBannerItem {
    exclusive: boolean;
    pic: string;
    targetId: number;
    targetType: number;
    typeTitle: string;
    url: string;
}

export interface RadioBanner {
    code: number;
    data: RadioBannerItem[]
}

export interface RadioSublistItem {
    id: number;
    programCount: number;
    intervenePicUrl: string;
    name: string;
    dj: DJ;
    newProgramCount: number;
    category: string;
}

export interface RadioSublist {
    code: number;
    count: number;
    djRadios: Array<RadioSublistItem>;
    hasMore: boolean;
    time: number;
}

export interface RadioDJDetailItem {
    id: number;
    category: string;
    categoryId: number;
    subCount: number;
    shareCount: number;
    subed: boolean;
    picUrl: string;
    desc: string;
    programCount: number;
    name: string;
    dj: DJ
}

export interface RadioDJDetail {
    code: number;
    data: RadioDJDetailItem
}

export interface RadioProgramDetailItem {
    coverUrl: string;
    id: number;
    name: string;
    liked: boolean;
    likedCount: number;
    listenerCount: number;
    //播放进度
    progress: number;
    createTime: number;
    duration: number;
    mainSong: SongDetailSongsItem;
    from: {
        path: string;
        name : string;
        val : any
    }
    radio: Radio;
    serialNum: number;
    commentCount: number;
    scheduledPublishTime : number;
}

export interface Radio {
    secondCategory: string;
    name: string;
    picUrl: string;
    category: string;
    categoryId: number;
    id: number;
    subCount: number;
    subed: boolean;
    createTime : number;
    lastProgramCreateTime: number;
    lastProgramId: number;
    listenerCount: number;
    programId: number;
    scheduledPublishTime : number;
    dj: DJ;
    programCount: number;
    playCount: number;
}

export interface RadioProgramDetail {
    code: number;
    count: number;
    more : boolean;
    programs: RadioProgramDetailItem[]
}

export interface UiElement {
    labelTexts: string[];
    labelType: string;
    subTitle: {
        title: string;
        titleType: string;
    };
    image: {
        imageUrl: string;
    };
    mainTitle: {
        title: string;
        categoryId: number;
    }
}

export interface Resource {
    resourceId: string;
    resourceType: string;
    uiElement: UiElement;
    resourceExtInfo: {
        djProgram: {
            mainSong: SongDetailSongsItem;
            radio: Radio;
            scheduledPublishTime : number;
        };
        playCount : number;
    }
}

export interface CreativeExtInfoVO {
    id: number;
    playCount: number;
    djProgram?: {
        category: string;
        coverUrl: string;
        mainSong: SongDetailSongsItem;
        id: number;
        dj : DJ
    };
    djPrograms?: Array<{
        mainSong: SongDetailSongsItem;
        radio: Radio;
        liked: boolean;
        coverUrl: string;
        id: number;
        listenerCount: number;
        scheduledPublishTime : number;
    }>;
    radio: Radio;
    banners: RadioBannerItem[];
}

export interface creative {
    creativeId: string;
    creativeType: string;
    traceId: string;
    creativeExtInfoVO: CreativeExtInfoVO;
    uiElement: UiElement;
    resources: Resource[]
}

export interface RadioVoiceItem {
    blockCode: string;
    creatives: Array<creative>;
    uiElement: UiElement;
    showType: string;
}

export interface RadioVoice {
    code: number;
    data: {
        cursor: string;
        blocks: RadioVoiceItem[];
    }
}

export interface RadioBatchGetItem {
    id: number;
    name: string;
}

export interface RadioBatch {
    '/api/dj/radio/category/second/get': {
        code: number;
        data: RadioBatchGetItem[];
    };
    '/api/djradio/hot': {
        code: number;
        count: number;
        djRadios: Array<HotTypeRadioItem>;
        hasMore: boolean;
    }
}

export interface RadioFM {
    code: number;
    data: Array<{
        creatives: creative[];
        creativeExtInfoVO: CreativeExtInfoVO
    }>
}

export interface RadioScene {
    code: number;
    data: {
        list: Array<{
            mainSong: SongDetailSongsItem;
            radio: Radio;
            liked: boolean;
            coverUrl: string;
            id: number;
            listenerCount: number;
        }>
    }
}

export interface SubscribersItem {
    avatarUrl: string;
    gender: number;
    nickname: string;
    userId: number;
    signature: string;
}

export interface Subscribers {
    code: number;
    hasMore?: boolean;
    more?: boolean;
    subscribers: SubscribersItem[];
    //请求电台订阅使用
    time?: number;
    //请求歌单订阅使用
    total?: number;
}

export interface Program {
    description: string;
    songs: Array<SongDetailSongsItem>;
    mainSong: SongDetailSongsItem;
    listenerCount: number;
    likedCount: number;
    id: number;
    liked: boolean;
    commentCount: number;
    radio: Radio;
    coverUrl: string;
    name: string;
    lastProgramId: number;
    canReward : boolean;
    dj : DJ;
    duration : number;
    adjustedPlayCount : number;
    scheduledPublishTime : number;
}


export interface ProgramDetail {
    code: number;
    program: Program;
}