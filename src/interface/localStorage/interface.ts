export interface CurrentPlay {
    mainSongId: number;
    mainSongName: string;
    mainSongPicUrl: string;
    mainSongSerialNum: number;
    progress: number;
}

export interface RadioItem {
    program: {
        [propname: string]: {
            progress: number;
        };
    };
    currentPlay: CurrentPlay;
}
