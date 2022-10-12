

import { lyricTime } from './filter'
/**
 * 根据时间点 找出最近的字幕 然后判断字幕的时间是否超出时间点？
 * @param arr lrcWords | translationLrcWords
 * @param lrcTimeArr lrcTimeArr | translationLrcTimeArr
 * @param latestTimeLyric latestTimeLyric | latestTimeTranslationLyric
 * @param val string
 */
let diffLyricTime = (
    arr: Array<{
        text: string;
        show: boolean;
    }>,
    lrcTimeArr: string[],
    latestTimeLyric: {
        index: number | undefined;
        item: {
            [propname: string]: any;
        };
    },
    val: string,
) => {
    arr.forEach((item, index) => {
        if (item.text.match(val)) {
            //如果找到了节点 那么就把上次找到的给清空
            if (latestTimeLyric.index !== undefined) {
                arr[latestTimeLyric.index].show = false;
            }
            item.show = true;

        } else {
            latestTimeLyric = getLatestTime(val, lrcTimeArr);
            //找到了最近的节点 判断当前的时间是不是小于这个节点的值
            let isTimeLong = false; //用于判断这个节点的字幕时间是否超过了当前播放的时间
            if (latestTimeLyric.index) {
                //先将最近节点的字幕时间提取出来
                //先转换为number进行比较
                let valNumber = parseInt(val.replace(":", ""));
                let timeNumber = parseInt(latestTimeLyric.item.replace(":", ""));
                if (timeNumber > valNumber) {
                    isTimeLong = true;
                }
            }
            if (index !== latestTimeLyric.index || isTimeLong) {
                item.show = false;
            } else {
                item.show = true;

            }
        }

    });
}


//提取最近时间
let getLatestTime = (time: string, arr: Array<string>) => {
    let result: {
        index: undefined | number;
        item: any;
    } = {
        index: undefined,
        item: {},
    };
    for (let i = arr.length - 1; i >= 0; i--) {
        //格式化时间
        if (arr[i].length < 9) arr[i] += '0'
        let item = parseInt(arr[i].replace(/:|\./g, ''));

        if (item < parseInt(time.replace(/:|\./g, ''))) {
            result.index = i;
            result.item = arr[i];
            break;
        }
    }
    return result;
};

let splitLyric = function (lyric: string, dt: number) {
    let lrcFirstMatch = lyric.match(/\[.*\].*/g);
    let lyricTimeArr: Array<string> = [];
    //歌词
    let lyricWords: Array<{
        text: string;
        show: boolean;
        startTime: number;
        endTime: number;
        currentTime: number;
    }> = [];
    if (lrcFirstMatch) {
        lrcFirstMatch = lrcFirstMatch.filter((item) => {
            if (item.replace(/\[.*\]/g, "").length === 0) return false;
            else return true;
        });
        lyricTimeArr = lrcFirstMatch.map((item: string) => {
            let match = item.match(/\[.*\]/g);
            if (match) {
                return match[0]?.replace(/\[|]/g, "");
            } else {
                return "";
            }
        });
        lrcFirstMatch.forEach((item, index) => {
            let match = item.match(/\d{1,2}:\d{1,2}.\d{1,3}/)
            let startTime = 0
            let endTime = 0
            let currentTime = 0
            if (match) {
                startTime = lyricTime(match[0])
            }

            let lrc = {
                text: item,
                show: false,
                startTime,
                endTime,
                currentTime
            };

            if (lyricWords[index - 1]) {
                lyricWords[index - 1].endTime = lrc.startTime
                lyricWords[index - 1].currentTime = lyricWords[index - 1].endTime - lyricWords[index - 1].startTime
            }

            lyricWords.push(lrc)
        });

        if (dt) {
            lyricWords[lyricWords.length - 1].endTime = dt
            lyricWords[lyricWords.length - 1].currentTime = dt - lyricWords[lyricWords.length - 1].startTime
        }
    }
    return {
        lyricTimeArr,
        lyricWords
    }
}

let splitTranslateLyric = function (tlyric: string) {
    let translationLrcFirstMatch = tlyric.match(/\[.*\].*/g);
    let tLyricTimeArr: Array<string> = [];
    let tLyricWords:
        Array<{
            text: string;
            show: boolean;
        }> = [];
    if (translationLrcFirstMatch) {
        translationLrcFirstMatch = translationLrcFirstMatch.filter((item) => {
            if (item.replace(/\[.*\]/g, "").length === 0) return false;
            else return true;
        });
        tLyricTimeArr = translationLrcFirstMatch.map((item: string) => {
            let match = item.match(/\[.*\]/g);
            if (match) {
                return match[0]?.replace(/\[|]/g, "");
            } else {
                return "";
            }
        });
        tLyricWords = translationLrcFirstMatch.map((item) => {
            let copyItem = item
            let match = copyItem.match(/\[.*\]/)
            if (match?.length) {
                let replaceMatch = match[0]
                let splitMatch = match[0].split('')
                if (splitMatch.length < 11) {
                    splitMatch.splice(9, 0, '0')
                    replaceMatch = splitMatch.join('')
                }
                copyItem = copyItem.replace(/\[.*\]/, replaceMatch)
            }
            let lrc = {
                text: copyItem,
                show: false,
            };
            return lrc;
        });
    }
    return {
        tLyricTimeArr,
        tLyricWords
    }
}

export {
    diffLyricTime,
    splitLyric,
    splitTranslateLyric
}