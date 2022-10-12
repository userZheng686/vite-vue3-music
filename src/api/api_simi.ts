import { get } from '@/utils/request'
import { SimiArtist, SimiPlayList, SimiSong } from 'i/api/api_simi.d'

/**
 * 调用此接口 , 传入歌曲 id, 可获得相似歌单
 * @param id 歌曲 id
 * @returns interface SimiPlayList
 */
export const getSimiPlayList = (id: number): SimiPlayList => get('/simi/playlist', { id })

/**
 * 获取相似歌手
 * @param id 歌手id
 * @param offset 偏移量
 * @param username 用户名
 * @param limit 返回的数量
 * @returns interface SimiArtist
 */
export const getSimiArtist = (id: number, offset: number, username?: string, limit?: number) : SimiArtist => get('/simi/artist', { id, limit, offset, username })

/**
 * 调用此接口 , 传入歌曲 id, 可获得相似歌曲
 * @param id 歌曲 id
 * @returns 
 */
export const getSimiSong = (id: number): SimiSong => get('/simi/song', { id })