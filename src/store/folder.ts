//显示文件夹
import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'

//用户添加的文件夹
let scanFolder = ref<string[]>([])
//用户选择的文件夹
let checkScanFolder = ref<string[]>([])

//获取用户添加的文件夹
let getScanFolder = async () => {
    scanFolder.value = await window.folderAPI.getUserScanFolder()
}

//获取用户选择的文件夹
let getCheckScanFolder = async () => {
    checkScanFolder.value = await window.folderAPI.getUserCheckScanFolder()
}

getScanFolder()
getCheckScanFolder()


export const useFolder = defineStore(Names.FOLDER, {
    state: () => {
        return {
            scanFolder,
            checkScanFolder
        }
    },
    getters: {

    },
    actions: {
        setScanFolder(val: string) {
            this.scanFolder.push(val)
            window.folderAPI.setUserScanFolder(val)
        },
        setCheckScanFolder(val: string[]) {
            this.checkScanFolder = val
            window.folderAPI.setUserCheckScanFolder(val)
        },
    }
})