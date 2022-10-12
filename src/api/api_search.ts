import { BestMatch, Search, SearchBatch } from 'i/api/api_search'
import { get } from '@/utils/request'

/**
 * 搜索多重匹配 猜你想搜和其他搜索的结果
 * @param keyword 搜索关键词
 * @param limit 每次请求返回的数量
 * @returns interface SearchBatch
 */
export const getSearchBatch = (keyword : string,limit : number) : SearchBatch => get('/search/batch',{keyword,limit})

/**
 * 感兴趣(最佳匹配)
 * @param keyword 搜索关键词
 * @returns interface BestMatch
 */
export const getBestMatch = (keyword : string) : BestMatch => get('/search/best/match',{keyword})

/**
 * 搜索
 * @param keywords 关键词
 * @param type // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频 2000 声音
 * @param limit 每次请求返回的数量 
 * @param offset 偏移量
 * @returns interface Search
 */
export const getSearch = (keywords : string,type : number,limit : number,offset : number) : Search => get('/cloudsearch',{keywords,type,limit,offset})