
import { get } from '@/utils/request';
import { Lyric } from 'i/api/api_lyric.d'

/**
 * 获取歌词（不需要登录）
 * @param id 音乐 id
 * @returns interface Lyric
 */
export const getLyric = (id: number): Lyric => get('/lyric', { id })