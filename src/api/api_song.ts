import { get } from '@/utils/request'
import { SongDetail, SongUrl, SongDownloadUrl } from 'i/api/api_song.d'

/**
 * 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(dt为歌曲时长)
 * @param ids 音乐 id, 如 ids=347230
 * @returns interface SongDetail
 */
export const getSongDetail = (ids: string): SongDetail => get('/song/detail', { ids })

/**
 * 获取客户端歌曲下载 url 使用 /song/url 接口获取的是歌曲试听 url, 但存在部分歌曲在非 VIP 账号上可以下载无损音质而不能试听无损音质, 使用此接口可使非 VIP 账号获取这些歌曲的无损音频
 * @param id 音乐 id (仅支持单首歌曲)
 * @param br 码率, 默认设置了 999000 即最大码率, 如果要 320k 则可设置为 320000, 其他类推
 * @returns interface SongDownloadUrl
 */
export const getSongDownloadUrl = (id: number, br?: number): SongDownloadUrl => get('/song/download/url', { id, br })

/**
 * 检查音乐是否可用
 * @param id 歌曲 id
 * @param br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 * @returns 
 */
export const getSongStatus = (id: number, br?: number): { message: string, success: boolean } => get('/check/music', { id, br })

/**
 *  使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,未登录状态或者非会员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param id 音乐 id
 * @param br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 * @returns interface SongUrl
 */
export const getSongUrl = (id: number, br?: number): SongUrl => get('/song/url', { id, br })