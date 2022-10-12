import { Radio } from './api_radio.d'

interface Quantity {
    br: number;
    fid: number;
    size: number;
    sr: number;
    vd: number;
}

export interface PrivilegesItem {
    chargeInfoList: Array<{
        chargeMessage: null
        chargeType: number
        chargeUrl: null
        rate: number;
    }>;
    downloadMaxbr: number;
    fee: number;
    fl: number;
    playMaxbr: number;
    plLevel : string;
    toast: boolean;
}


export interface SongDetailSongsItem {
    al: {
        id: number;
        name: string;
        picUrl: string;
        tns: string[];
    };
    //专辑
    album: {
        id: number;
        name: string;
        picUrl: string;
        tns: string[];
    };
    alias?: string[];
    alia?: string[];
    ar: Array<{
        alias: string[];
        id: number;
        name: string;
        tns: string[];
    }>;
    //播客
    artists: Array<{
        alias: string[];
        id: number;
        name: string;
        tns: string[];
    }>;
    //翻译
    transName: string;
    sq: boolean | Quantity;
    sqMusic: Quantity;
    hrMusic: Quantity;
    hr: Quantity;
    name: string;
    pop?: number;
    fee?: number;
    tns?: string[];
    noCopyrightRcmd?: null | any;
    originCoverType?: number;
    author?: string;
    mv?: number;
    mvid: number;
    playTime?: number;
    id: number | string;
    publishTime: number;
    //歌曲的播放时间由页面实际控制 这里不做任何处理
    dt?: string;
    //播客 歌曲播放时长
    duration?: number;
    //本地歌曲原播放时长
    originDt: number;
    //格式
    type?: string;
    //大小
    fileSize?: string;
    //文件名
    fileName: string;
    //上传时间
    addTime?: number;
    //当前播放列表 用于记录来源
    from: {
        name: string;
        path: string,
        val?: {
            [propname: string]: any
        }
    };
    //记录当前播放状态 是暂停还是播放？
    status: string;
    //判断是否是喜欢的音乐
    like: boolean;
    //歌曲播放地址 如果是本地就采用绝对路径播放
    songUrl?: string;
    //下载进度
    progress: number;
    //歌曲数据 如果是无损就是lossless
    privilege: {
        dlLevel: string;
        plLevel: string;
        maxBrLevel: string;
        maxbr: number;
    };
    //下载的时间
    downloadTime: number;
    //下载状态 (begin 开始 pause 暂停 resume 恢复 cancel 取消 complete 完成)
    downloadStatus: string;
    //下载进度
    downloadReceivedBytes: number;
    //url
    downloadUrl: string;
    //热度
    score: number;
    //是否收藏（播客）
    starred: boolean;
    //是否点赞（播客）
    liked: boolean;
    //电台
    radio: Radio;
    //电台节目id
    radioId: number;
    pc?: {
        alb: string;
        ar: string;
        br: number;
        fn: string;
        sn: string;
        uid: number;
    };
    //电台节目编号
    serialNum?: number;
    //电台评论id  用来区分是不是电台节目
    commentThreadId?: number;
    //记录上次的播放进度
    lastProgress?: number;
    //不感兴趣
    alg: string;
    trackIds: {
        id: number;
        ratio: number;
        lr: number;
    };
    //评论数量
    commentCount: number;
    //播放次数
    playCount : number;
    //歌词
    lyrics ?: string[];
    //播放的音质
    plLevel : string;
}




export interface SongDetail {
    code: number;
    privileges: PrivilegesItem[];
    songs: SongDetailSongsItem[];
}

export interface SongUrl {
    code: number;
    data: Array<{
        br: number;
        fee: number;
        url: string;
    }>

}

export interface SongDownloadUrl {
    code: number;
    data: {
        br: number;
        encodeType: string;
        url: string;
    }
}