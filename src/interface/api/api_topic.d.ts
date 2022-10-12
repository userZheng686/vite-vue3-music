import { UserEvenEvents } from "./api_eventt";
import { CreatorType } from "./api_playList";

export interface HotTopicItem {
    actId: number;
    title: string;
    sharePicUrl: string;
    participateCount : number;
}

export interface HotTopic {
    code: number;
    hot: HotTopicItem[];
}

export interface Topic {
    coverUrl : string;
    creator : CreatorType;
    id : number;
    mainTitle : string;
}

export interface TopicDetail{
    code : number;
    act : {
        actId : number;
        title : string;
        text : string[];
        sharePicUrl : string;
        coverPCUrl : string;
        coverPCListUrl : string;
        participateCount: number;
    }
}


export interface TopicDetailEvent{
    events : UserEvenEvents[];
    lasttime : number;
    more : boolean;
    size : number;
    code : number;
}

export interface TopicDetailEventHot {
    events : UserEvenEvents[];
    code : number;
}

export interface TopicDetailRcmdListItem {
    actId : number;
    title : string;
    sharePicUrl:string;
    participateCount : number;
    reason : string;
}

export interface TopicDetailRcmdList{
    rcmd: TopicDetailRcmdListItem[];
    code : number;
}

export interface TopicSoaring{
    code : number;
    soaring : HotTopicItem[]
}



export interface TopicSearch{
    code : number;
    result : {
        exist : boolean;
        topicCount : number;
        topics : HotTopicItem[]
    }
}