export interface UserEvenEvents {
    info: {
        commentThread: {
            resourceTitle : string;
        },
        liked: boolean,
        likedCount: number,
        commentCount : number;
        shareCount : number;
    };
    json : string;
    parseJson : any;
    pics : Array<{
        height : number;
        width : number;
        pcSquareUrl  : string;
        originUrl: string;
    }>;
    user : {
        avatarUrl : string;
        nickname : string;
        userId : number;
        avatarDetail : {
            identityIconUrl : string;
        }
    };
    id : number;
    eventTime: number;
    xInfo : UserEvenEventsxInfo;
    
}

export interface UserEvenEventsxInfo {
    info : {
        latestLikedUsers : Array<UserEvenEventsxInfoLikedUsers>
    }
}

export interface UserEvenEventsxInfoLikedUsers {
    avatarUrl : string;
    userId : number;
}


export interface UserEven{
    lasttime : number;
    more : boolean;
    size : number;
    events : UserEvenEvents[]
}

export interface EventHistory{
    code : number;
    data : {
        cursor : string;
        events : UserEvenEvents[];
        more : boolean;
    }
}

export interface UserEventDetail{
    code : number;
    event : UserEvenEvents
}