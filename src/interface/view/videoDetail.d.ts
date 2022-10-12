import { VideoCommentItem } from "i/api/api_comment.d";
export interface btn {
    likeCount: number;
    liked: boolean;
    subscribeCount: number;
    subscribed: boolean;
    shareCount: number;
}

export interface userInfo {
    avatarUrl: string;
    nickname: string;
    followed: boolean;
    userId: number;
}

export interface comment {
    total: number;
    //热评
    hotComments: VideoCommentItem[];
    //热评是否更多
    hotMore: boolean;
    //普通评论
    comments: VideoCommentItem[];
}

export interface videoName {
    title: string;
    publishTime: number;
    playTime: number;
}

export interface tag {
    id: number;
    name: string;
}

export interface downloadItem {
    fileName: string;
    mvId: number;
    cover: string;
    name: string;
    currentProgress: number;
    userInfo: Array<{
        id: number; name: string; img1v1Url: string; followed: boolean
    }>;
    videoParam: string[];
    //下载状态
    downloadStatus: string;
    //下载速度
    downloadReceivedBytes: number;
    //url
    downloadUrl: string;

}