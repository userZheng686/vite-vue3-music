export interface UserPlaylistTalentTags{
    tags : string[];
    code : number;
}

export interface UserPlaylistTalentItem {
    signature : string;
    playlistBeSubscribedCount : number;
    detailDescription : string;
    avatarDetail : {
        identityIconUrl : string;
    };
    avatarUrl : string;
    nickname : string;
    followed : boolean;
    userId : number;
}

export interface UserPlaylistTalent{
    talents : UserPlaylistTalentItem[];
    more : boolean;
    code : number;
}


export interface UserRecommendCelebrities{
    celebrities : UserPlaylistTalentItem[];
    more : boolean;
    singerCount : number;
    djCount : number;
    musicianCount : number;
    code : number;
}

export interface DiscoveryTopUserlistItem {
    nickname : string;
    userId : number;
}

export interface DiscoveryTopUserlist {
    updateTime : number;
    frequency : string;
    users : DiscoveryTopUserlistItem[]
}