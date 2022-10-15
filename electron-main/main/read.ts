import fs from "fs";
import path from 'path';
//生成base64编码 用于图片src
import { Base64 } from "js-base64";
//存储163key
import { setSong163Key, getSong163Key, clear163key } from './store';

import * as mm from 'music-metadata'
import * as crypto from 'crypto'
import * as util from 'util'
import * as ffmetadata from 'ffmetadata'


//读取目录中的所有文件
let readDir = (dirPath: string) => {
    return fs.readdirSync(dirPath);
};

interface decode {
    format: string;
    musicId: number;
    musicName: string;
    artist: Array<Array<string | number>>;
    album: string;
    albumId: number;
    albumPic: string;
    mvId: number;
    bitrate: number;
    duration: number;
    alias: string[];
    transNames: string;
}

interface encodeOrigin {
    id: number;
    name: string;
    artists: Array<{
        name: string;
        id: number;
    }>;
    ar: Array<{
        name: string;
        id: number;
    }>;
    pc: {
        ar: string;
        id: number;
    };
    album: {
        name: string;
        id: number;
        picUrl: string;
    };
    al: {
        name: string;
        id: number;
        picUrl: string;
    };
    mvid: number;
    bitrate: number;
    duration: number;
    dt: number;
    alias: string[];
    transName: string;
}

//容量计算
//根据指定的单位来转换容量计算
let diskSize = function (size: number, unit: string) {
    let res = ''
    let B = 8
    let KB = 1024 * B
    let MB = 1024 * KB
    let GB = 1024 * MB
    let TB = 1024 * GB

    switch (unit) {
        case 'K': { res = String(size / KB) }; break;
        case 'M': { res = String(size / MB) }; break;
        case 'G': { res = String(size / GB) }; break;
        case 'T': { res = String(size / TB) }; break;
    }

    return res
}

//音频播放时间计算
let transTime = (time: number, isHaveMillisecond?: boolean) => {
    let mill
    if (isHaveMillisecond) {
        mill = String(time).split('.')[1]?.substring(0, 3)
    }
    let duration = parseInt(String(time));
    let minute: string | number = parseInt(String(duration / 60));
    let sec = (duration % 60) + "";
    let isM0 = ":";
    if (minute === 0) {
        minute = "00";
    } else if (minute < 10) {
        minute = "0" + minute;
    }
    if (sec.length === 1) {
        sec = "0" + sec;
    }

    if (mill) {
        return minute + isM0 + sec + '.' + mill;
    } else {
        return minute + isM0 + sec;
    }
};

let setObj = (filePath: string, decodeJson: decode | null, common: any, format: any) => {
    let fileSize = diskSize(format.bitrate * format.duration, "M");
    if (fileSize.split(".").length) {
        fileSize = fileSize.split(".")[0] + "." + fileSize.split(".")[1]?.substring(0, 2);
    }
    let obj = {};
    let picUrl = '';
    let ar = []
    if (decodeJson?.albumPic) {
        picUrl = decodeJson.albumPic
    } else {
        if (common?.picture?.length) {
            //自定义协议 不然会有安全问题
            picUrl = `data:${common?.picture[0].format};base64,${Base64.fromUint8Array(
                common?.picture[0].data
            )}`
        } else {
            picUrl = `http://p3.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg?param=1024y1024`
        }
    }
    if (decodeJson?.artist) {
        ar.push({
            alias: [],
            id: decodeJson.artist[0][1],
            name: decodeJson.artist[0][0],
            tns: []
        })
    } else {
        if (common.artist) {
            ar.push({
                alias: [],
                id: 0,
                name: common.artist,
                tns: [],
            })
        }
    }
    try {
        //这里对应的数据结构是SongDetailSongsItem
        if (decodeJson) {
            obj = {
                al: {
                    id: decodeJson.albumId,
                    name: decodeJson.album,
                    alias: [],
                    picUrl,
                    tns: []
                },
                ar,
                sq: format.lossless ? true : false,
                id: decodeJson.musicId,
                mvid: decodeJson.mvId,
                name: decodeJson.musicName,
                fileSize,
                bitrate: format.bitrate,
                dt: transTime(format.duration),
                originDt: parseInt(String(format.duration * 1000)),
                from: {
                    name: "我下载的音乐",
                    path: 'localDownload',
                    val: {
                        type: 1,
                        key: 'song'
                    }
                },
                songUrl: filePath,
                status: "no-play",
                like: false,
                is163key: true
            }
        } else {
            //这里都是本地的音频文件 对应的专辑id 歌手id等都是不可能有的 所以就只能填0 然后歌曲的id用title生成
            obj = {
                al: {
                    id: 0,
                    name: common.album,
                    picUrl,
                    tns: [],
                },
                ar,
                sq: format.lossless ? true : false,
                name: common.title ? common.title : '未知名字',
                fileSize,
                bitrate: format.bitrate,
                dt: transTime(format.duration),
                originDt: parseInt(String(format.duration * 1000)),
                from: {
                    name: "我下载的音乐",
                    path: 'localDownload',
                    val: {
                        type: 1,
                        key: 'song'
                    }
                },
                songUrl: filePath,
                status: "no-play",
                id: filePath,
                like: false,
                is163key: false
            };
        }
    } catch (e) {
        console.log('e', e)
    }


    return obj;
};

//对163key进行一个解码
let decode163Key = (comment: string): decode => {
    let json
    try {
        const aes128ecbDecipher = crypto.createDecipheriv(
            "aes-128-ecb",
            "#14ljk_!\\]&0U<'(",
            ""
        );
        const aesd =
            aes128ecbDecipher.update(comment, "base64") + aes128ecbDecipher.final();
        json = JSON.parse(aesd.substring(6))
    } catch (e) {
        json = null
    } finally {
        return json
    }

}

//加密方法
let encode = (encodeText: string) => {
    const aes128ecbDecipher = crypto.createCipheriv(
        "aes-128-ecb",
        "#14ljk_!\\]&0U<'(",
        ""
    );
    const aesd =
        aes128ecbDecipher.update(encodeText, "utf-8", "base64") +
        aes128ecbDecipher.final("base64");
    return aesd;
};


//加密
let encode163Key = (path: string, obj: encodeOrigin) => {
    return new Promise((resolve, reject) => {
        let artist: Array<Array<string | number>> = []
        if (obj?.artists?.length) {
            obj.artists.forEach(item => {
                artist.push([item.name, item.id])
            })
        } else if (obj?.ar?.length) {
            obj.ar.forEach(item => {
                artist.push([item.name, item.id])
            })
        } else if (obj?.pc) {
            artist = [[obj.pc.ar, obj.pc.id]]
        }
        let encodeObj = {
            format: path.split('.')[1],
            musicId: obj.id,
            musicName: obj.name,
            artist,
            album: obj?.album?.name || obj?.al?.name,
            albumId: obj?.album?.id || obj?.al?.id,
            albumPic: obj?.album?.picUrl || obj?.al?.picUrl,
            mvId: obj?.mvid,
            bitrate: parseInt(String(obj.bitrate)),
            duration: obj.duration || obj.dt,
            alias: obj.alias,
            transNames: obj.transName || [],
        }
        let encodeKey = encode(`music:${JSON.stringify(encodeObj)}`)
        encodeKey = `163 key(Don't modify):${encodeKey}`
        setSong163Key(path, encodeKey)
        resolve(encodeKey)
    })

}

//清空所有的163key（测试）
let testClear163Key = (filePath: string) => {
    return new Promise(resolve => {
        clear163key()
        resolve('1')
    })

}


//读取歌曲的文件元信息
let readFileMusic = async (filePath: string) => {
    // await testClear163Key(filePath)
    return new Promise(async (resolve, reject) => {
        const metadata = await mm.parseFile(path.join(filePath));
        const { common, format } = metadata
        let key = getSong163Key(filePath)
        let obj = {}, decodeJson: any
        if (key) {
            decodeJson = decode163Key(key.substring(22))
            if (decodeJson) {
                obj = setObj(filePath, decodeJson, common, format)
            } else {
                obj = setObj(filePath, null, common, format)
            }
            resolve(JSON.stringify(obj))
        } else {
            ffmetadata.read(filePath, function (err, data) {
                let { comment } = data
                setSong163Key(filePath, comment)
                if (comment) {
                    decodeJson = decode163Key(comment.substring(22))
                }
                if (decodeJson) {
                    obj = setObj(filePath, decodeJson, common, format)
                } else {
                    obj = setObj(filePath, null, common, format)
                }
                resolve(JSON.stringify(obj))
            })
        }
    })
}

//读取MV的文件元信息
let readFileMV = async (filePath: string) => {
    return new Promise(async (resolve, reject) => {
        const metadata = await mm.parseFile(path.join(filePath));
        const { common, format } = metadata
        let fileSize = diskSize(format.bitrate * format.duration, "M");
        if (fileSize.split(".").length) {
            fileSize = fileSize.split(".")[0] + "." + fileSize.split(".")[1]?.substring(0, 2);
        }
        resolve(fileSize)
    })
}

//写入歌曲的文件元信息
let writeFileMusicMetadata = async (filePath: string, obj: encodeOrigin) => {
    return new Promise(async (resolve, reject) => {
        let artistName = obj?.artists?.map(item => item.name) || obj?.ar?.map(item => item.name) || obj?.pc?.ar || ''
        let albumName = obj?.album?.name || obj?.al?.name
        let comment = await encode163Key(filePath, obj)
        let options = {
            artist: artistName,
            album: albumName,
            title: obj?.name,
            comment
        };
        console.log('comment', options)
        ffmetadata.write(filePath, options, function (err) {
            if (err) console.error("Error writing cover art");
            else console.log("Cover art added");
        })
    })
}

export {
    readDir,
    readFileMusic,
    readFileMV,
    writeFileMusicMetadata,
    encode163Key
}