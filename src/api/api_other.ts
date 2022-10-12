import { get } from '@/utils/request'
import { suggest, hotListSuccess, Banner } from 'i/api/api_other.d'

/**
 * 搜索建议 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息
 * @param keywords keywords : 关键词
 * @param type type : 如果传 'mobile' 则返回移动端数据
 * @returns interface suggest
 */
export const getSuggest = (keywords: string, type?: string): suggest => get('/search/suggest', { keywords, type })

/**
 * 热搜列表(详细)
 * @returns hotListSuccess
 */
export const getHotSearch = (): hotListSuccess => get('/search/hot/detail')


/**
 * 获取轮播图
* @param type  type:资源类型,对应以下类型,默认为 0 即 PC
    0: pc

    1: android

    2: iphone

    3: ipad
 * 
 * @returns interface Banner
 */
export const getBanner = (type?: number): Banner => get('/banner')

