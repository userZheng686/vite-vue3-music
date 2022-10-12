import { get } from '@/utils/request'
import { AlbumDynamic, AlbumPriviledge, ArtistAlbum, ArtistAlbumSongs, CollectSubList, TopAlbum } from 'i/api/api_album.d'

/**
 * 获取用户收藏的专辑
 * @param limit 取出数量 默认25
 * @param offset 偏移数量 默认为0
 * @returns interfaced CollectSubList
 */
export const getAlbumSubList = (limit: number, offset: number): CollectSubList => get('/album/sublist', { limit, offset })

/**
 * 专辑动态
 * @param id 专辑id 
 * @returns interface AlbumDynamic
 */
export const getAlbumDynamic = (id: number): AlbumDynamic => get('/album/detail/dynamic', { id })

/**
 * 获取歌手专辑
 * @param id 歌手id
 * @param offset 偏移量
 * @returns interface ArtistAlbum
 */
export const getArtistAlbum = (id : number,offset : number) : ArtistAlbum => get('/artist/album',{id,offset})


/**
 * 获取歌手页专辑歌曲
 * @param id 专辑id
 * @returns interface ArtistAlbumSongs
 */
export const getArtistAlbumSongs = (id : number) : ArtistAlbumSongs => get('/album/detail',{id})

/**
 * 专辑歌曲详情
 * @param id 专辑id
 * @param offset 偏移量
 * @param limit 获取数量 默认为100
 * @returns interface AlbumPriviledge
 */
export const getAlbumPriviledge = (id: number, offset: number, limit?: number): AlbumPriviledge => get('/album/priviledge', { id, offset, limit })

/**
 * 收藏/取消收藏专辑 调用此接口,可收藏/取消收藏专辑
 * @param id  专辑 id
 * @param t  1 为收藏,其他为取消收藏
 * @returns 
 */
export const collectAlbumSub = (id: number, t: number) => get('/album/sub', { id, t })

/**
 * 新碟上架 调用此接口 , 可获取新碟上架列表 , 如需具体音乐信息需要调用获取专辑列表接 口 /album , 然后传入 id, 如 /album?id=32311&limit=30
 * @param limit 取出数量 , 默认为 50
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * @param area ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param type new:全部 hot:热门,默认为 new
 * @param year  年,默认本年
 * @param month 月,默认本月
 * @returns interface TopAlbum
 */
export const getTopAlbum = (limit?: number, offset?: number, area?: string, type?: string, year?: string, month?: string): TopAlbum => get('/top/album', { limit, offset, area, type, year, month })