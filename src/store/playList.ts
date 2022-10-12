//音乐播放列表

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'
import { SongDetailSongsItem } from 'i/api/api_song.d'
import { RadioDJDetailItem } from "i/api/api_radio.d";
import { currentListIndex, isPlay, list, lrcWords, translationLrcWords, isLightMusic } from '@/localStorage/init'
import { ElMessage } from 'element-plus';


//字幕时间 一般来说都是提取好的时间 比如[xx:xx.xxx]这种
let lrcTimeArr: Array<string> = []
//翻译后的字幕时间 一般来说都是提取好的时间 比如[xx:xx.xxx]这种
let translationLyricTimeArr: Array<string> = []
//当前播放的时间
let audioStartMill: string = ""
//跳转指定时间
let skipAssignTime: null | Function = null
//当前打开的电台
let radio: RadioDJDetailItem | null = null
//FM播放
let fmNextPlay = () => { }



export const useSongStore = defineStore(Names.SONG, {
    state: () => {
        return {
            list,
            //当前播放歌曲在list的位置
            currentListIndex,
            lrcTimeArr,
            translationLyricTimeArr,
            audioStartMill,
            lrcWords,
            translationLrcWords,
            skipAssignTime,
            isLightMusic,
            radio,
            fmNextPlay
        }
    },
    getters: {

    },
    actions: {
        //添加歌曲列表
        setSongList(val: SongDetailSongsItem) {
            let id = val.id
            let isRepeatSong = false
            //专辑歌曲
            if(val.fee === 4) {
             ElMessage.warning(val.name + '需要购买专辑')
             return;
            }
            this.list.forEach(item => {
                //重置所有的播放状态
                item.status = 'play'
                if (item.id === id) isRepeatSong = true
            })
            val.status = 'play'
            //假如队列不重复 就添加进去
            if (!isRepeatSong) {
                this.list.push(val);
            }
        },
        //更新歌曲状态 是暂停还是播放？
        updateSongStatus(id: number | string, stauts: string) {
            this.list.forEach(item => {
                if (item.id === id) item.status = stauts
            })
            isPlay.value = stauts === 'play' ? true : false
        },
        //更新当前播放的列表下表
        setListIndex(val: number) {
            this.currentListIndex = val
        },
        //移除列表的歌曲
        removeListItem(id: number | string) {
            let index = this.list.findIndex(item => item.id === id);
            if (index !== -1) {
                this.list.splice(index, 1)
            }
        },
        //设置字幕时间
        setLyricTimeArr(val: Array<string>) {
            this.lrcTimeArr = val
        },
        //设置翻译过后的字幕时间
        setTranslationLyricTimeArr(val: Array<string>) {
            this.translationLyricTimeArr = val
        },
        //设置字幕
        setLrcWords(val: Array<{
            text: string;
            show: boolean;
            currentTime: number;
            endTime: number;
            startTime: number;
        }>) {
            this.lrcWords = val
        },
        //设置翻译过后的字幕
        setTranslationLrcWords(val: Array<{
            text: string;
            show: boolean;
        }>) {
            this.translationLrcWords = val
        },
        //设置当前歌曲播放的时间
        setCurrentSongPlayTime(val: string) {
            this.audioStartMill = val
        },
        //设置当前跳转时间的函数
        setSkipAssignTime(val: Function) {
            this.skipAssignTime = val
        },
        //调用方法
        useSkipAssignTime(val: string) {
            if (this.skipAssignTime) {
                this.skipAssignTime(val)
            }
        },
        //设置 更新当前打开的电台
        setRadio(r: RadioDJDetailItem | null) {
            this.radio = r
        }
    }
})