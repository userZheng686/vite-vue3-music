import fs from 'fs'
// const acrcloud = require("acrcloud");


// const acr = new acrcloud({
//     host: "identify-cn-north-1.acrcloud.cn",
//     access_key: "fcbbf52df763fe60a3c6e26bd63109d6",
//     access_secret: "oze0zJV1lUTWXHPcCimm3ONSlW970WuRTTSbI8c7"
// });

// export function identifyMusic(filePath: string) {
//     return new Promise(async (resolve) => {
//         //剪切 只取音频的前10s
//         //这地方用到了AudioBuffer
//         let buffer = fs.readFileSync(filePath)
//         acr.audio_format = 'flac'
//         // let newBuffer = await cutAudio(buffer)
//         // resolve(newBuffer)
//         acr.identify(buffer).then(metadata => {
//             resolve(metadata);
//         });
//     })
// }

//裁剪音频
function cutAudio(buffer: Buffer) {
    return new Promise((resolve) => {
        let audioCtx = new AudioContext()
        audioCtx.decodeAudioData(buffer).then(function (audioBuffer) {
            // 声道数量和采样率
            let channels = audioBuffer.numberOfChannels;
            let rate = audioBuffer.sampleRate;

            // 截取前8秒
            let startOffset = 0;
            let endOffset = rate * 8;
            // 8秒对应的帧数
            let frameCount = endOffset - startOffset;

            // 创建同样采用率、同样声道数量，长度是前3秒的空的AudioBuffer
            let newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);
            // 创建临时的Array存放复制的buffer数据
            let anotherArray = new Float32Array(frameCount);
            // 声道的数据的复制和写入
            let offset = 0;
            for (let channel = 0; channel < channels; channel++) {
                audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
                newAudioBuffer.copyToChannel(anotherArray, channel, offset);
            }
            resolve(newAudioBuffer)
            // newAudioBuffer就是全新的复制的3秒长度的AudioBuffer对象
        })
    })
}