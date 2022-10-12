export interface RecommentLiveItem {
    liveData: {
        liveCoverUrl: string;
        liveTitle: string;
        liveId: number;
        webRoomUrl: string;
        popularity: number;
        userInfo: {
            artistName: string;
            avatarDetail: {
                identityIconUrl: string;
            };
            avatarUrl: string;
        }
        tag: {
            content: string;
            type: number;
        }
    }
}

export interface RecommentLive {
    code: number;
    data: {
        hasMore: boolean;
        itemList: RecommentLiveItem[]
    }
}