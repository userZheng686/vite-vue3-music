import { get, upload } from '@/utils/request'
import { UserCloud, UserCloudDataItem } from 'i/api/api_cloudDisk.d'
import type { Ref } from 'vue'

/**
 * 登录后调用此接口 , 可获取云盘数据 , 获取的数据没有对应 url, 需要再调用一 次 /song/url 获取 url
 * @param limit 返回数量 , 默认为 50
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认为 0
 * @returns interface UserCloud
 */
export const getUserCloud = (limit?: number, offset?: number): UserCloud => get('/user/cloud', { limit, offset })

/**
 * 登录后调用此接口 , 可删除云盘歌曲
 * @param id 歌曲 id,可多个,用逗号隔开
 * @returns 
 */
export const delUserCloud = (id : string) => get('/user/cloud/del',{id})

/**
 * 文件上传（歌曲）
 * @param file 要上传的文件
 * @param downLoadProgress 上传进度
 * @returns 上传结果 类型是UserCloudDataItem
 */
export const uploadSong = (file: File, downLoadProgress: Ref<number>) => {
    let formData = new FormData()
    formData.append('songFile', file)
    return upload(formData, '/cloud', downLoadProgress)
}