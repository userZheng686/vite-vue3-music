import { dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

//选择文件夹
export function openFolder() {
    return new Promise((resolve) => {
        let path = dialog.showOpenDialogSync({
            title: '选择添加目录',
            properties: ['openFile', 'openDirectory']
        })
        resolve(path)
    })
}

//选择音频文件
export function openSong() {
    return new Promise((resolve) => {
        let filePath = dialog.showOpenDialogSync({
            title: '打开',
            defaultPath: 'C:\\Users\\ZERO\\Music',
            buttonLabel: "选择",
            filters: [
                { name: '音乐文件', extensions: ['mp3', 'aac', 'wma', 'wav', 'ogg', 'm4a', 'ape', 'flac', 'cue'] },
            ],
            properties: ['openFile']
        })
        let file = {
            name: path.basename(filePath[0]),
            data: fs.readFileSync(filePath[0])
        }
        resolve(file)
    })

}