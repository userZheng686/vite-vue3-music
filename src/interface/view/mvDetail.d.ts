

import { VideoCommentItem } from "i/api/api_comment.d";
export interface mvName {
    name: string;
    publishTime: string;
    playCount: number;
}

export interface btn {
    likeCount: number;
    liked: boolean;
    subscribeCount: number;
    subscribed: boolean;
    shareCount: number;
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