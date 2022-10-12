interface Callback {
    enterSongDetail: Function;
    prevSong: Function;
    playMusic: Function;
    nextSong: Function;
    forward: Function;
    rewind: Function;
    operateRadio: Function;
    operateMusic: Function;
}


export const playCallbackOption: Callback = {
    enterSongDetail: () => { },
    prevSong: () => { },
    playMusic: () => { },
    nextSong: () => { },
    forward: () => { },
    rewind: () => { },
    operateRadio: () => { },
    operateMusic: () => { },
}

export function initPlayCallback(option: Callback) {
    Object.assign(playCallbackOption, option)
}
