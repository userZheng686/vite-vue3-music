import { nextTick } from 'vue'
import { createBuffer, getSessionId } from './sandbox.js'
//歌曲识别
import { getMatchSong } from '@/api/api_match'
//接口声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//上下文
let audioContext = new AudioContext({ sampleRate: 8e3 });
//来源
let source;
//audio
let audioElement: HTMLAudioElement;
//用于记录被匹配的次数
let times = 1;

//初始化整个audioContext
let init = async (without163Key: SongDetailSongsItem[], match: SongDetailSongsItem[], noMatch: number) => {
    await audioContext.audioWorklet.addModule("/src/components/localDownload/PitchProcessor.js");
    const PitchProcessor = new AudioWorkletNode(
        audioContext,
        "PitchProcessor"
    );
    PitchProcessor.port.onmessage = (e) => {
        let data = e.data.result;
        let newData = (function (t, e) {
            const r = new Float32Array(e);
            for (let n = 0; n < e; n++) r[n] = t[n];
            return r;
        })(data, 48e3).buffer;

        const result = createBuffer().ExtractQueryFP(newData),
            r = new Int8Array(result.size());
        for (let t = 0; t < result.size(); t++) r[t] = result.get(t);
        if (r.buffer.byteLength === 64) return;
        createResult(without163Key, r.buffer, match, noMatch)
    };
    PitchProcessor.connect(audioContext.destination);

    let audio = document.querySelector(".local--audio") as HTMLAudioElement;
    if (audio) {
        audioElement = audio
    }

    //加载音频
    source = audioContext.createMediaElementSource(audioElement as HTMLAudioElement);
    source.connect(PitchProcessor);
    source.connect(audioContext.destination);
};


let Ze = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

let Ke = function (e) {
    var t,
        n = new Uint8Array(e),
        r = n.length,
        o = "";
    for (t = 0; t < r; t += 3)
        (o += Ze[n[t] >> 2]),
            (o += Ze[((3 & n[t]) << 4) | (n[t + 1] >> 4)]),
            (o += Ze[((15 & n[t + 1]) << 2) | (n[t + 2] >> 6)]),
            (o += Ze[63 & n[t + 2]]);
    return (
        r % 3 == 2
            ? (o = o.substring(0, o.length - 1) + "=")
            : r % 3 == 1 && (o = o.substring(0, o.length - 2) + "=="),
        o
    );
};


let createResult = async (without163Key: SongDetailSongsItem[], data: ArrayBuffer, match: SongDetailSongsItem[], noMatch: number) => {
    let result = await getMatchSong(getSessionId(), Ke(data))
    if (result?.data?.result?.length) {
        audioElement.pause()
        //过滤 找出真正的歌曲
        let score = 0, scoreIndex = 0;
        result.data.result.forEach((item, i) => {
            if (item.song.score > score) {
                score = item.song.score;
                scoreIndex = i
            }
        })

        //填充原数据
        let obj = { ...without163Key[0] }
        Object.assign(obj, result.data.result[scoreIndex].song)
        obj.al = obj.album;
        obj.ar = obj.artists;
        match.push(obj)
        try {
            let writeResult = await window.readAPI.write163Key(obj.songUrl, JSON.stringify(obj))
        } catch (e) {
        } finally {
            without163Key.shift()
            //更新时间
            audioElement.currentTime = 0
            nextTick(() => {
                audioElement.play()
            })
            times = 1
        }
    } else if (times >= 5) {
        let obj = { ...without163Key[0] }
        match.push(obj)
        without163Key.shift()
        noMatch++;
        //更新时间
        audioElement.currentTime = 0
        nextTick(() => {
            audioElement.play()
        })
    } else {
        times++
    }

};



export {
    init
}

