import { UserEvenEvents } from "./api_event";
import { SongDetailSongsItem } from 'i/api/api_song.d';
import { Album } from "./api_album";
import { Topic } from "./api_topic";
import { playlist } from "./api_playList";
import { MV } from "./api_mv";
import { Video } from "./api_video";
import { Program, Radio } from "./api_radio";
import { EventArtist } from "./api_artist";

export interface PrivateMsgItem {
    fromUser: {
        nickname: string;
        avatarUrl: string;
        userId: number;
        avatarDetail?: {
            identityIconUrl: string;
        }
    };
    lastMsg: string;
    parseMsg: any;
    lastMsgTime: number;
    newMsgCount: number;
}

export interface PrivateMsg {
    msgs: PrivateMsgItem[];
    more: boolean;
    code: number;
    newMsgCount: number;
}

export interface PrivateMsgHistoryMsgsItem {
    msg: string;
    parseMsg: any;
    time: number;
    id: number;
    fromUser: {
        nickname: string;
        avatarUrl: string;
        userId: number;
        avatarDetail?: {
            identityIconUrl: string;
        };
    };
    toUser: {
        nickname: string;
        avatarUrl: string;
        userId: number;
        avatarDetail?: {
            identityIconUrl: string;
        };
    }
}

export interface PrivateMsgHistory {
    code: number;
    more: boolean;
    isArtist: boolean;
    isSubed: boolean;
    msgs: PrivateMsgHistoryMsgsItem[]
}

export interface MsgCommentsItem {
    user: {
        avatarUrl: string;
        nickname: string;
        userId: number;
    };
    beRepliedUser: {
        avatarUrl: string;
        nickname: string;
        userId: number;
    };
    beRepliedContent: string;
    content: string;
    resourceJson: string;
    parseResourceJson: any;
    time: number;
}

export interface MsgComments {
    code: number;
    total: number;
    more: boolean;
    comments: MsgCommentsItem[]
}



export interface MsgForwardsItem {
    json: string;
    parseJson: {
        comment ?: {
            commentId: number;
            content: string;
            time: number;
            user: {
                avatarUrl: string;
                nickname: string;
                userId: number;
            };
        };
        json ?: string;
        parseJson ?: {
            msg : string;
            event : UserEvenEvents;
            song : SongDetailSongsItem;
            album : Album;
            topic : Topic;
            playlist : playlist;
            mv : MV;
            video : Video;
            program : Program;
            resource : EventArtist;
            djRadio : Radio;
        };
        resource: any;
        resourceType: ResourceType;
        user?: {
            avatarUrl: string;
            nickname: string;
            userId: number;
        }
    };
    userId: number;
    time: number;
    id: number;
    //1 分享 转发 动态 2 话题 3 资源 评论
    type: 1 | 2 | 3;
}

export interface MsgNoticesItem{
    id : number;
    time : number;
    notice : string;
    parseNotice : {
        comment ?: {
            content : string;
        };
        playlist ?: playlist;
        track ?: UserEvenEvents;
        type : number;
        specialType : number;
        user : {
            nickname: string;
            userId : number;
            avatarUrl : string;
        }
    };
}

export interface MsgNotices {
    notices : MsgNoticesItem[];
    more : boolean;
    code : number;
}

export interface MsgForwards {
    newCount: number;
    lasttime: number;
    more: boolean;
    forwards: MsgForwardsItem[];
    code: number;
}

export interface Result {
    code: number;
    id: number;
}

export interface PrivateMessage {
    newMsgs: Array<PrivateMsgHistoryMsgsItem>
}

//0 歌单 1 播客节目 2 动态(EventListItem)  3 专辑 4 单曲 18 话题 22 转发
export type ResourceType = 0 | 1 | 2 | 3 | 4 | 18 | 22

export type sendType = 'song' | 'mv' | 'video' | 'playlist' | 'djradio' | 'album' | 'djprogram'