//收藏歌单或者创建歌单的弹窗

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'

//收藏歌单
let collectSongMenuShow = false;
//创建歌单
let createSongMenuShow = false;
//收藏的歌曲id数组
let collectSongIds : number[] = []

export const useSongMenuPopupStore = defineStore(Names.SONGMENUPOPUP, {
    state: () => {
        return {
            collectSongMenuShow,
            createSongMenuShow,
            collectSongIds
        }
    },
    actions: {


    }
})