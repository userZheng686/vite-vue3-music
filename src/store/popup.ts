//弹窗相关

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'

let isOpenLoginPopup: boolean = false
let isOpenMenuPopup: boolean = false
let isOpenMask: boolean = false
let isOpenPrivateLetter: boolean = false

export const usePopupStore = defineStore(Names.POPUP, {
    state: () => {
        return {
            isOpenLoginPopup,
            isOpenMenuPopup,
            isOpenMask,
            isOpenPrivateLetter
        }
    },
    getters: {

    },
    actions: {
        setLoginPopup(val: boolean) {
            this.isOpenLoginPopup = val
        },
        setMenuPopup(val: boolean) {
            this.isOpenLoginPopup = val
        },
        setPrivateLetterPopup(val: boolean) {
            this.isOpenPrivateLetter = val
        },
    }
})