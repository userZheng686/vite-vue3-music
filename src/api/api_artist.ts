import { get } from '@/utils/request'
import { Artist, ArtistByArtists, ArtistDetail, ArtistDetailDynamic, ArtistIntroduction, ArtistNewSong, ArtistNewSongPlayall, ArtistSubList } from 'i/api/api_artist.d'

/**
 * 歌手分类列表
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页
 * @param initial 首字母索引查找参数
 * @param type [{-1 : '全部'},{1:'男歌手'},{2:'女歌手'},{3:'乐队'} ]
 * @param area [{-1 : '全部'},{7 : '华语'},{96 : '欧美'},{8 : '日本'},{16 : '韩国'},{0:'其他'}]
 * @returns interface Artist
 */
export const getArtist = (limit?: number, offset?: number, initial?: string, type?: number, area?: number): Artist => get('/artist/list', { limit, offset, initial, type, area });

/**
 * 获取用户收藏的歌手列表
 * @param limit 返回数量 , 默认为 25
 * @param offset 偏移数量，用于分页
 * @returns interface ArtistSubList
 */
export const getArtistSubList = (limit: number, offset: number): ArtistSubList => get('/artist/sublist', { limit, offset })

/**
 * 收藏/取消收藏歌手
 * @param id 歌手id
 * @param t 1 收藏 其他为取消收藏
 * @returns 
 */
export const subArtist = (id: number, t: number) => get('/artist/sub', { id, t })

/**
 * 获取歌手详情
 * @param id 歌手id
 * @returns interface ArtistDetail
 */
export const getArtistDetail = (id: number): ArtistDetail => get('/artist/detail', { id })

/**
 * 歌手是否关注 是否有演出
 * @param id 歌手id
 * @returns interface ArtistDetailDynamic
 */
export const getArtistDetailDynamic = (id: number): ArtistDetailDynamic => get('/artist/detail/dynamic', { id })

/**
 * 获取歌手演出列表
 * @param artistId 歌手id
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @returns interface ArtistByArtists
 */
export const getArtistByArtists = (artistId: number, offset: number, limit?: number): ArtistByArtists => get('/artist/byartist', { artistId, offset, limit })

/**
 * 获取歌手简介
 * @param id 歌手id
 * @param offset 偏移量
 * @param limit 返回的数量
 * @returns interface ArtistIntroduction
 */
export const getArtistIntroduction = (id: number, offset: number, limit: number): ArtistIntroduction => get('/artist/desc', { id, offset, limit })

/**
 * 歌手榜
 * @param type 地区 [{1:'华语'},{1:'欧美'},{1:'韩国'},{1:'日本'}]
 * @returns 
 */
export const getArtistTop = (type?: number) => get('/toplist/artist')


/**
 * 获取新歌发布
 * @param startTimestamp 用于下次请求的时间戳 
 * @param sourceType 1 歌曲
 * @param limit 每次请求返回的数量
 * @param firstRequest 是否是第一次请求
 * @returns interface ArtistNewSong
 */
export const getArtistNewSong = (startTimestamp: number, sourceType: number, limit: number,firstRequest : boolean) : ArtistNewSong => get('/artist/new/song', { startTimestamp, sourceType, limit,firstRequest })

/**
 * 获取新歌发布 播放全部歌曲（50首）
 * @returns interface ArtistNewSongPlayall
 */
export const getArtistNewSongPlayall = () : ArtistNewSongPlayall => get('/artist/new/song/playall')