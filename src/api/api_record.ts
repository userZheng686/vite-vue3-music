import { get } from '@/utils/request'
import { RecentSong } from 'i/api/api_record.d'


/**
 * 可获得最近播放-歌曲
 * @param limit 返回数量 , 默认为 100
 * @returns inteface RecentSong
 */
export const getRecentSong = (limit?: number): RecentSong => get('/record/recent/song', { limit })