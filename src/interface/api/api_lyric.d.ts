export interface User {
    demand: number;
    id: number;
    nickname: string;
    status: number;
    uptime: number;
    userid: number;

}

export interface lrc {
    lyric: string;
}


export interface Lyric {
    code: number;
    lrc: lrc;
    lyricUser: User;
    qfy: boolean;
    sfy: boolean;
    sgc: boolean;
    romalrc: lrc;
    tlyric: lrc;
    transUser: User;
    yrc?: {
        lyric: string;
    }
}