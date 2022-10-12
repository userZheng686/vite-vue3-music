import { get } from '@/utils/request';
import { CollectVideo } from 'i/api/api_collect.d'



/**
 * 收藏/取消收藏 MV
 * @param mvid  MV id
 * @param t 1 为收藏,其他为取消收藏
 * @returns 
 */
export const getCollectMv = (mvid: number, t: number): CollectVideo => get('/mv/sub', { mvid, t })

/**
 * 收藏/取消收藏视频
 * @param id 视频 id
 * @param t  1 为收藏,其他为取消收藏
 * @returns interface CollectVideo
 */
export const getCollectVideo = (id: string, t: number): CollectVideo => get('/video/sub', { id, t })