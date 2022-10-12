export interface VideoCommentItem {
    //内容
    content: string;
    //时间
    time: number;
    //是否点赞
    liked: boolean;
    //点赞数量
    likedCount: number;
    //用户 头像 用户名 用户id
    user: {
        avatarUrl: string;
        nickname: string;
        userId: number;
    };
    //回复
    beReplied: Array<{
        content: string;
        user: {
            nickname: string;
            userId: number;
        }
    }>;
    //id
    commentId: number;
}

export interface VideoComment {
    code: number;
    //评论总数
    total: number;
    //歌单所属的用户id
    userId: number;
    //热评
    hotComments: VideoCommentItem[];
    //普通评论
    comments: VideoCommentItem[];
    //是否更多评论
    more: boolean;
    //是否更多热门评论
    moreHot: boolean;
}

export interface CommentSend {
    code: number;
    comment: {
        beRepliedUser: {
            avatarUrl: string
            nickname: string;
            userId: number;
        };
        commentId: number;
        content: string;
        time: number;
        user: {
            avatarUrl: string;
            userId: number;
            nickname: string
        };
        liked: boolean;
        likedCount: number;
        //回复
        beReplied: Array<{
            content: string;
            user: {
                nickname: string;
                userId: number;
            }
        }>;
    };

}

export interface CommentNewItem {
    content: string;
    time: number;
    user: {
        avatarUrl: string;
        nickname: string;
        userId: number;
    };
    liked: boolean;
    likedCount: number;
}

export interface CommentNew {
    code: number;
    data: CommentNewItem[];
}

export interface CommentHot {
    code: number;
    hasMore: boolean;
    hotComments: VideoCommentItem[];
    topComments: VideoCommentItem[];
    total: number;
}

export interface ResourceCommentInfoItem {
    commentCount: number;
    shareCount: number;
    liked: boolean;
    resourceId: number;
}

export interface ResouceCommentInfo {
    code: number;
    data: Array<ResourceCommentInfoItem>
}