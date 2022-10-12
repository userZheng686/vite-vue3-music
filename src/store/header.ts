//header显示

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'

let isShowHeader = false
let isSticky = false
let name = ''

export const useHeader = defineStore(Names.HEADER, {
    state: () => {
        return {
            isShowHeader,
            isSticky,
            name
        }
    },
    getters: {

    },
    actions: {
        //设置header是否显示
        setHeaderVisible(val: boolean) {
            this.isShowHeader = val
            this.isSticky = false
        },
        //设置name是否显示
        setStickyStatus(val: boolean) {
            this.isSticky = val
        },
        //设置name
        setName(val: string) {
            this.name = val
        },
    }
})