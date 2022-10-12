import { PersonalFM, Trash } from 'i/api/api_private'
import { get } from '@/utils/request'


/**
 * 获取私人FM
 * @returns interface PersonalFM
 */
export const getPersonalFM = (): PersonalFM => get('/personal_fm')

/**
 * 垃圾桶 调用此接口 , 传入音乐 id, 可把该音乐从私人 FM 中移除至垃圾桶
 * @param id 歌曲 id
 * @param alg 类型
 * @param time 跳过时间
 * @returns 
 */
export const fmTrash = (id: number, alg: string, time: number) => get('/fm_trash', { id, alg, time })

/**
 * 获取垃圾桶列表
 * @param offset 偏移量 ;
 * @param addTime 时间
 * @returns interface Trash
 */
export const getTrash = (offset: number, addTime: number): Trash => get('/trash/get', { offset, addTime })

/**
 * 垃圾桶列表还原
 * @param songIds 歌曲id数组
 * @returns 
 */
export const removeTrash = (songIds: string) => get('/trash/remove', { songIds })

/**
 * 推荐不感兴趣
 * @param resources 资源id 格式 {resourceId: 28151051, resourceType: 4, targetUrl: '', encId: '28151051'}
 * @returns 
 */
export const fmDislike = (resources: string) => get('/fm/dislike', { resources })

/**
 * 私人FM跳过 继续获取私人FM
 * @returns interface  PersonalFM
 */
export const getPersonalFMSkip = (songId: number): PersonalFM => get('/personal_fm/skip', { songId })