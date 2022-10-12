import { CreatorType } from './api_playList.d'
export interface RecommendMVItem {
    picUrl: string;
    name: string;
    author: string;
    playCount: number;
    artistId: number;
    id: number;
    alg: string;
    artists: Array<{
        alias: string[];
        name: string;
        id: number;
    }>;
    commentCount: number;
    subed: boolean;
    mvDownload : string;
    downloadStatus : string;
}

export interface RecommendMV {
    category: number;
    code: number;
    result: RecommendMVItem[]
}

export interface VideoCategoryItem {
    abExtInfo: null;
    id: number;
    name: string;
    relatedVideoType: string;
    selectTab: boolean;
    url: null;
}

export interface VideoCategory {
    code: number;
    data: VideoCategoryItem[]
}

export interface CategoryVideoListItem {
    alg: string;
    displayed: boolean;
    extAlg: null
    type: number;
    data: CategoryVideoListItemData;
}

export interface CategoryVideoListItemData {
    commentCount: number;
    //封面
    coverUrl: string;
    //包含作者信息
    author: string;
    creator: CreatorType;
    artists: Array<{
        id: number;
        name: string;
    }>;
    //标题
    title: string;
    name: string;
    //播放时间
    durationms: number;
    duration: number;
    height: number;
    width: number;
    //播放次数
    playTime: number;
    playCount: number;
    previewDurationms: number;
    //预览视频链接
    previewUrl: string;
    //点赞
    praisedCount: number;
    //分享
    shareCount: number;
    //标签
    videoGroup: Array<{
        id: number;
        name: string;
        alg: null;
    }>;
    //是否点赞
    praised: boolean;
    //是否关注
    subscribed: boolean;
    //这个好像是直播用的 暂时没用到 用到了在写具体点
    liveData: any;
    //视频id
    vid: string;
    //视频类型 0 mv 1 视频
    type : number;
}

export interface CategoryVideoList {
    code: number;
    hasmore: boolean;
    msg: string;
    rcmdLimit: number;
    datas: Array<CategoryVideoListItem>
}

export interface VideoDetailVideoGroupItem {
    id: number;
    name: string;
    alg: null
}

export interface VideoDetailResolutionsItem {
    size: number;
    resolution: number;
}

export interface VideoDetail {
    code: number;
    data: {
        //默认视频清晰度
        width: number;
        height: number;
        //标签分组
        videoGroup: VideoDetailVideoGroupItem[];
        //视频标题
        title: string;
        //发布时间
        publishTime: number;
        //视频清晰度
        resolutions: VideoDetailResolutionsItem[];
        //播放次数
        playTime: number;
        //作者
        creator: CreatorType;
        //封面
        coverUrl: string;
        //视频文案介绍
        description: string;
    };
    message: string;
}

export interface VideoDetailSubscribe {
    code: number;
    data: {
        //播放次属
        playTime: number;
        //点赞数量
        praisedCount: number;
        //收藏数量
        subscribeCount: number;
        //是否关注
        subscribed: boolean;
    };
    message: string;
}

export interface VideoDetailInfo {
    code: number;
    commentCount: number;
    //是否点赞
    liked: boolean;
    likedCount: number;
    shareCount: number;
}

export interface VideoUrlItem {
    id: string;
    url: string;
    size: number;
    r: number;
    needPay: boolean;
    payInfo: null;
    validityTime: number;
}

export interface VideoUrl {
    code: number;
    urls: VideoUrlItem[]
}

export interface videoRelatedRecommendItem {
    coverUrl: string;
    title: string;
    type: number;
    vid: string;
    creator: Array<{
        userName: string;
        userId: number;
    }>;
    playTime: number;
    durationms: number;
}

export interface videoRelatedRecommend {
    code: number;
    message: string;
    data: videoRelatedRecommendItem[]
}


export interface VideoTagItem {
    id: number;
    name: string;
}

export interface VideoTag {
    code: number;
    data: Array<VideoTagItem>
}

export interface VideoSubListItem {
    alg?: string;
    aliaName: string;
    coverUrl: string;
    creator: Array<{
        userId: number;
        userName: string;
    }>
    durationms: number;
    playTime: number;
    title: string;
    transName: string;
    type: number;
    vid: string;
}

export interface VideoSubList {
    code: number;
    data: VideoSubListItem[];
    hasMore: boolean;
}

export interface Video {
    durationms : number;
    playTime : number;
    title : string;
    coverUrl : string;
    creator : CreatorType;
    videoId : string;
}