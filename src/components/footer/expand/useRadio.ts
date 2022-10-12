//收藏电台
import { RadioSub } from "@/api/api_radio";
//电台节目点赞
import { getResourceLike } from "@/api/api_like";
import { radio } from "@/localStorage/init";
import emitter from "@/utils/eventBus";
import { patchUpdateRadioSubed, updateRadioProgramLiked } from "@/utils/update";

//收藏或者取消收藏电台
export async function collectRadio(songList: any, elMessage: any) {
    try {
        let res = await RadioSub(songList.list[songList.currentListIndex]?.radio?.id, songList.list[songList.currentListIndex]?.radio?.subed ? 2 : 1);
        songList.list[songList.currentListIndex].radio.subed = !songList.list[songList.currentListIndex].radio.subed
        if (songList.list[songList.currentListIndex]?.radio?.subed === false) {
            elMessage.success("取消收藏成功");
            songList.radio && songList.radio.subCount--;
        } else {
            elMessage.success("收藏成功");
            songList.radio && songList.radio.subCount++;
        }
        if (songList.radio) {
            songList.radio.subed = !songList.radio.subed;
        }
        patchUpdateRadioSubed(songList.list[songList.currentListIndex]?.radio.id, songList.list[songList.currentListIndex].radio.subed)
    } catch (e: any) {
        elMessage.error(e?.message || "操作失败 请重新试试");
    }
};

//点赞电台节目
export async function operateRadio(songList: any, elMessage: any) {
    try {
        let res = await getResourceLike(
            4,
            songList.list[songList.currentListIndex].liked ? 0 : 1,
            songList.list[songList.currentListIndex]?.radio?.programId
        );
        elMessage.success(
            `${!songList.list[songList.currentListIndex].liked ? "已成功点赞" : "取消点赞成功"}`
        );
        songList.list[songList.currentListIndex].liked = !songList.list[
            songList.currentListIndex
        ].liked;
        emitter.emit("updateProgramLike", {
            id: songList.list[songList.currentListIndex]?.radio?.programId,
            liked: songList.list[songList.currentListIndex].liked,
        });
        updateRadioProgramLiked(songList.list[songList.currentListIndex]?.radio?.programId, songList.list[songList.currentListIndex].liked)
    } catch (e: any) {
        elMessage.error(e?.message || "操作失败");
    }
};


//更新电台进度条（主要是电台节目）
export function updateRadioProgress(songList: any, progress: number) {
    if (!songList.list[songList.currentListIndex]?.radio) return
    progress = parseInt(String(progress))
    let radioId = songList.list[songList.currentListIndex]?.radio?.id
    let programId = songList.list[songList.currentListIndex]?.radio?.programId
    let mainSongId = songList.list[songList.currentListIndex]?.id
    let mainSongName = songList.list[songList.currentListIndex]?.name
    let mainSongPicUrl = songList.list[songList.currentListIndex]?.album?.picUrl
    let mainSongSerialNum = songList.list[songList.currentListIndex]?.serialNum
    if (radio.value[radioId]?.program[`${programId}`]?.progress === 100) return
    if (progress <= radio.value[radioId]?.program[`${programId}`]?.progress) return
    let radioItem = radio.value[radioId]
    if (radioItem) {
        radioItem.currentPlay = {
            mainSongId,
            mainSongName,
            mainSongPicUrl,
            mainSongSerialNum,
            progress
        }
        let programList = radioItem.program
        if (programList) {
            programList[`${programId}`] = {
                progress
            }
        } else {
            programList = {
                [`${programId}`]: {
                    progress
                }
            }
        }
        radioItem.program = programList
        radio.value[radioId] = radioItem
    } else {
        radio.value[radioId] = {
            currentPlay: {
                mainSongId,
                mainSongName,
                mainSongPicUrl,
                mainSongSerialNum,
                progress
            },
            program: {
                [`${programId}`]: {
                    progress
                }
            }
        }
    }
    emitter.emit('updateProgramProgress', {
        id: programId,
        progress
    })
}

//根据上次播放的进度跳转到指定的时间
export function useSkipTime(songList: any) {
    let lastProgress = songList.list[songList.currentListIndex]?.lastProgress;
    let time = 0
    //如果是已经下载好的文件 那么就不跳转
    if (songList.list[songList.currentListIndex].songUrl && !songList.radio?.id) return time;
    if (lastProgress && lastProgress < 100) {
        let durations = songList.list[songList.currentListIndex]?.duration;
        if (durations) {
            let percent = durations / 100;
            let skipTime = lastProgress * percent;
            //这里需要除以1000 因为用的是毫秒
            time = skipTime / 1000
        }
    }
    return time
}