import { get } from '@/utils/request'
import { TopMusic } from 'i/api/api_music.d'

/**
 * /* 新歌速递 
 * @param type //全部:0 华语:7 欧美:96 日本:8 韩国:16
 * @returns interface TopMusic
 */
export const getTopMusic = (type: number): TopMusic => get('/top/song', { type })