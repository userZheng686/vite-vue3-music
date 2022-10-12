//歌曲评论弹窗

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'


let isShowSongComment: boolean = false
let isShowRadioComment: boolean = false

export const useSongCommentStore = defineStore(Names.SONGCOMMENT, {
    state: () => {
        return {
            isShowSongComment,
            isShowRadioComment
        }
    },
    getters: {

    },
    actions: {
        setSongCommentShow(val: boolean) {
            this.isShowSongComment = val
        },
        setRadioCommentShow(val: boolean) {
            this.isShowRadioComment = val
        },
    }
})