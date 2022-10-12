import { CreatorType } from 'i/api/api_playList.d';

export interface item {
    author: string;
    artists: Array<{
        alias?: string[];
        name: string;
    }>;
    creator?: CreatorType
}

export interface songItem {
    ar: Array<{
        id: number;
        name: string;
        tns: string[];
        alias: string[];
    }>;
    author: string;
    playTime: number
}