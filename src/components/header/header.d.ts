import { hotListItem } from "i/api/api_other.d";

export interface list {
    id: string;
    name: string;
    isOver: boolean;
}

export interface form {
    keywords: string;
    hotList: Array<hotListItem>;
    showInfoTip: boolean;
}

