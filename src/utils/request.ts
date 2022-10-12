import service from './axios'
import axios from "axios";
import type { Ref } from 'vue'
import { cookie } from '@/localStorage/init'
import { downloadItem } from 'i/view/videoDetail';
import { SongDetailSongsItem } from 'i/api/api_song.d';
import { baseUrl } from './config';
//中间件处理 将不需要缓存的接口提取出来 然后做一层包装
let noCachePath = ['/user/playlist', '/playlist/tracks', '/mv/sub', '/video/sub', '/comment/hot', '/comment/mv', '/comment/video',
    '/resource/like', '/mv/all', '/mv/detail', '/mv/detail/info', '/record/recent/song', '/video/detail', '/video/detail/info', '/song/download/url','/msg/forwards','/msg/notices','/users/batch','/user/follow/recommend',
    '/video/statistic', '/login/qr/check', '/comment/music', '/comment/playlist', '/likelist', '/dj/program', '/dj/radio/hot', '/dj/category/second', '/video/timeline/all', '/dj/subscriber', '/user/subcount', '/dj/sub', '/dj/detail', '/dj/sublist', '/check/music', '/playlist/detail', '/comment/dj', '/user/detail', '/login/status','/artist/detail','/artist/album',
    '/mv/sublist','/comment/like','/event/forwards','/comment/event','/album/sublist','/video/sublist','/comment/album','/msg/private','/msg/private/history','/msg/private/delete/single','/pl/count','/personalized/privatceontent/list'
]

export function get(url: string, params?: any): any {
    if (noCachePath.includes(url)) params.timestamp = new Date().getTime()
    if (!params) params = {}
    return new Promise((resolve, reject) => {
        service.get(url, { params }).then((res: any) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

function getImgSize(file: File) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (theFile) {
            let image = new Image()
            if (theFile.target?.result) {
                image.src = theFile.target.result
            }
            image.onload = function () {
                resolve({
                    width: this.width,
                    height: this.height,
                })
            }
        }
    })
}

interface uploadCoverResult {
    code: number;
    data: {
        url: string;
    }
}

export async function uploadPlaylistCover(id: number, file: File): Promise<uploadCoverResult> {
    return new Promise(async (resolve, reject) => {
        if (window.cookieAPI) {
            cookie.value = await window.cookieAPI.getCookie()
        }
        let formData = new FormData()
        formData.append('imgFile', file)
        const imgSize = await getImgSize(file)
        const res = await axios({
            method: 'post',
            url: `${baseUrl}/playlist/cover/update?id=${id}&cookie=${cookie.value}&imgSize=${imgSize.width
                }&imgX=0&imgY=0&timestamp=${Date.now()}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        })
        resolve(res.data)
    })
}

export async function uploadAvatar(file: File): Promise<uploadCoverResult> {
    return new Promise(async (resolve, reject) => {
        if (window.cookieAPI) {
            cookie.value = await window.cookieAPI.getCookie()
        }
        let formData = new FormData()
        formData.append('imgFile', file)
        const imgSize = await getImgSize(file)
        const res = await axios({
            method: 'post',
            url: `${baseUrl}/avatar/upload?cookie=${cookie.value}&imgSize=${imgSize.width
                }&imgX=0&imgY=0&timestamp=${Date.now()}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        })
        resolve(res.data)
    })
}


export async function upload(formdata: FormData, url: string, downLoadProgress: Ref<number>) {
    if (window.cookieAPI) {
        cookie.value = await window.cookieAPI.getCookie()
    }
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${baseUrl}${url}?time=${Date.now()}&cookie=${cookie.value}`,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formdata,
            withCredentials: true,
            onDownloadProgress: function (progressEvent: ProgressEvent) {
                if (progressEvent.lengthComputable) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    downLoadProgress.value = progressEvent.loaded / progressEvent.total * 100 //实时获取最新下载进度
                }
            }
        }).then((res: any) => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}


export function download(url: string): any {
    return new Promise((resolve, reject) => {
        axios.get(url, { responseType: 'blob' }).then((res: any) => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export function downloadSong(url: string, item: SongDetailSongsItem, callback: Function) {
    return axios({
        url,
        method: 'get',
        responseType: 'blob',
        onDownloadProgress(progress) {
            callback(progress, item)
        }
    })

}

export function downloadMV(url: string, item: downloadItem, callback: Function, currentDownloadProgress: Ref<number>) {
    return axios({
        url,
        method: 'get',
        responseType: 'blob',
        onDownloadProgress(progress) {
            callback(progress, item, currentDownloadProgress)
        }
    })

}