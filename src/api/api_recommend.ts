import { DiscoveryTopUserlist, UserPlaylistTalent, UserPlaylistTalentTags, UserRecommendCelebrities } from 'i/api/api_recommend'
import { get } from '@/utils/request'

/**
 * 获取音乐达人标签
 * @returns interface UserPlaylistTalentTags
 */
export const getUserPlaylistTalentTags = () : UserPlaylistTalentTags => get('/user/playlistTalent/tags',)

/**
 * 音乐达人
 * @param tagName 标签名 
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @returns interface UserPlaylistTalent
 */
export const getUserPlaylistTalent = (tagName : string,offset : number,limit : number) : UserPlaylistTalent => get('/user/playlistTalent',{tagName,offset,limit})

/**
 * 用户周榜
 * @param type  1 明星 2音乐达人 3dj  6 网易音乐人
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @param cursor 用于下次请求
 * @returns interface DiscoveryTopUserlist
 */
export const getDiscoveryTopUserlist = (type : number,offset : number,limit : number,cursor : string | number) : DiscoveryTopUserlist => get('/discovery/topUserlist',{type,offset,limit,cursor})

/**
 * 获取用户推荐
 * @param type 1 dj用户 2 明星用户 4 网易音乐人
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @returns interface UserRecommendCelebrities
 */
export const getUserRecommendCelebrities = (type : number,offset : number,limit : number)  : UserRecommendCelebrities => get('/user/recommend/celebrities',{type,offset,limit}) 