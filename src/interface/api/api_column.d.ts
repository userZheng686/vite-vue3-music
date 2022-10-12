export interface ColumnSubListItem {
    author: string;
    id: number;
    readCount: number;
    rectanglePicUrl: string;
    resUrl: string;
    subTime: number;
    title: string;
    userId: number;
}

export interface ColumnSubList {
    code: number;
    hasMore: boolean;
    count: number;
    data: ColumnSubListItem[]
}

export interface ColumnCreateListItem {
    coverUrl : string;
    topicCount : number;
    name : string;
    readCount : number;
    id : number;
}

export interface ColumnCreateList {
    code : number;
    commentCount : number;
    data : ColumnCreateListItem[]
}