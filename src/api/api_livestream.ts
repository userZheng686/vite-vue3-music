import { RecommentLive } from 'i/api/api_livestream';
import { get } from '@/utils/request';

/**
 * 获取直播数据
 * @param offset : 偏移量;
 * @param limit  : 限制每次返回的数量
 * @returns interface RecommentLive
 */
export const getRecommentLive = (offset: number, limit: number): RecommentLive => get('/livestream/dragonball', { offset, limit }) 