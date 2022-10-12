import { get } from '@/utils/request'
import { EliteSongMenu, HotSongMenu, FriendEliteSongMenu, EliteSongMenuTag, SearchResult, UserSongMenu, playlist, RecommendSongMenuPersonalized, PrivateContent, SongMenuDetail, SongMenuCategory, SongToSongMenu, RadarList, SongList, EditSongMenuCategory, RecommendSongs, PreviewPlaylist, UserRecord, IntelligencePlay } from 'i/api/api_playList.d'
import { encryptResult } from "@/utils/encrypt";
import { Subscribers } from 'i/api/api_radio.d';
import { SongDetailSongsItem } from 'i/api/api_song.d';

/**
 * 登录后调用此接口 , 可获取心动模式/智能播放列表 必选参数 : id : 歌曲 id
 * @param id 歌曲 id
 * @param pid 歌单 id
 * @param count 歌单歌曲数量
 * @param sid 要开始播放的歌曲的 id
 * @returns interface IntelligencePlay
 */
export const intelligencePlay = (songId : number,playlistId : number,count : number,startMusicId ?: number) : IntelligencePlay => get('/playlist/intelligence',{songId,playlistId,count,startMusicId})


/**
 * 获取精选歌单(网友)
 * @param order 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param cat tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * @param limit 取出歌单数量 , 默认为 50
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 * @returns interface FriendEliteSongMenu
 */
export const getFriendEliteSongMenu = (order?: string, cat?: string, limit?: number, offset?: number): FriendEliteSongMenu => get('/top/playlist', { order, limit, cat, offset })

/**
 * 热门歌单分类
 * @returns interface HotSongMenu
 */
export const getHotSongMenu = (): HotSongMenu => get('/playlist/hot')

/**
 * 精品歌单标签列表 调用此接口 , 可获取精品歌单标签列表
 * @returns interface EliteSongMenuTag
 */
export const getEliteSongMenuTag = (): EliteSongMenuTag => get('/playlist/highquality/tags')

/**
 * 歌单分类 调用此接口,可获取歌单分类,包含 category 信息
 * @returns interface SongMenuCategory
 */
export const getSongMenuCategory = (): SongMenuCategory => get('/playlist/catlist')

/**
 * 歌单分类 调用此接口,可获取歌单分类,包含 category 信息
 * @returns interface SongMenuCategory
 */
export const getEditSongMenuCategory = (): EditSongMenuCategory => get('/playlist/editlist')

/**
 * 获取网友的精品歌单
 * @param cat 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * @param limit 取出歌单数量 , 默认为 20
 * @param before 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 * @returns interface EliteSongMenu
 */
export const getEliteSongMenu = (cat?: string, limit?: number, before?: number): EliteSongMenu => get('/top/playlist/highquality', { cat, limit, before })

/**
 * 根据用户id获取用户歌单
 * @param uid 用户 id
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns interface UserSongMenu
 */
export const getUserSongMenu = (uid: number, limit?: number, offset?: number): UserSongMenu => get('/user/playlist', { uid, limit, offset })

/**
 * 调用此接口 , 传入歌单 id 可删除歌单
 * @param id 歌单 id
 * @returns 
 */
export const deletePlaylist = (id : number) => get('/playlist/delete',{id})


/**
 * 获取用户听歌记录
 * @param uid 用户 id
 * @param type 1: 最近一周, 0: 所有时间
 * @returns interface UserRecord
 */
export const getUserRecord = (uid : number,type : number) : UserRecord => get('/user/record', { uid, type})

/**
 * 搜索 歌单 音乐 专辑 歌手 用户
 * @param key interface encryptResult
 * @returns interface SearchResult
 */
export const getSearchResult = (key: encryptResult): SearchResult => get('/cloudsearch/get/web', key)


/**
 * 获取雷达歌单
 * @returns interface RadarList
 */
export const getRadarList = (): RadarList => get('/radar/list')

/**
 * 获取排行榜
 * @returns 
 */
export const getTopList = () => get('/toplist')

/**
 * 根据歌单id获取歌单列表
 * @param ids 歌单id 规定,拼接
 * @returns interface SongList
 */
export const getSongList = (ids: string): SongList => get('/playlist/get', { ids })

/**
 * 获取用户页面的歌单详情（包括歌曲）
 * @param id 歌单id
 * @returns interface PreviewPlaylist
 */
export const getPreviewPlaylist = (id : number) : PreviewPlaylist => get('/preview/playlist',{id})

/**
 * 根据歌单id获取歌单详情 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，但是返回的 trackIds 是完整的，tracks 则是不完整的
 * @param id 歌单 id
 * @param s 歌单最近的 s 个收藏者,默认为 8
 * @returns interface SongMenuDetail
 */
export const getSongMenuDetail = (id: number, s?: number): SongMenuDetail => get('/playlist/detail', { id })

/**
 *  调用此接口 , 传入歌单名字可新建歌单
 * @param name 歌单名
 * @param privacy 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
 * @param type 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
 * @returns interface  { id: number; playlist: playlist }
 */
export const createSongMenu = (name: string, privacy?: string, type?: string): { id: number; playlist: playlist } => get('/playlist/create', { name, privacy, type })

/**
 * 调用此接口 , 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
 * @param t 类型,1:收藏,2:取消收藏
 * @param id 歌单 id
 * @returns 
 */
export const collectSongMenu = (t: number, id: number) => get('/playlist/subscribe', { t, id })

/**
 * 调用此接口 , 传入歌单 id 可获取歌单的所有收藏者
 * @param id 歌单 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @returns interface Subscribers
 */
export const getPlayListSubscribers = (id: number, limit?: number, offset?: number): Subscribers => get('/playlist/subscribers', { id, limit, offset })

/**
 * 对歌单添加或删除歌曲
 * @param op 从歌单增加单曲为 add, 删除为 del
 * @param pid 歌单 id 
 * @param tracks  歌曲 id,可多个,用逗号隔开
 * @returns interface SongToSongMenu
 */
export const addSongToSongMenu = (op: string, pid: number, tracks: number | string): SongToSongMenu => get('/playlist/tracks', { op, pid, tracks })

/**
 *  登录后调用此接口,可以更新用户歌单
 * @param id 歌单id
 * @param name 歌单名字
 * @param desc 歌单描述
 * @param tags 歌单tag ,多个用 `;` 隔开,只能用官方规定标签
 * @returns 
 */
export const updatePlaylist = (id: number, name: string, desc: string, tags: string) => get('/playlist/update', { id, name, desc, tags })


/**
 * 获取每日推荐歌曲
 * @param offset : 偏移量;
 * @returns interface SongDetailSongsItem[]
 */
export const getRecommendSongs = (offset: number): RecommendSongs => get('/recommend/songs', { offset })


/**
 * 歌单/歌曲 不感兴趣
 * @param dislikeId 歌单/歌曲id 
 * @param resType 1 歌单 4 歌曲
 * @param alg 标签
 * @param filterIds 推荐的歌单/歌曲id数组 
 * @param userPlaySongs 用户最近播放的歌曲 可不传
 * @returns 
 */
export const dislikePlaylist = (dislikeId: number, resType: number, alg: string, filterIds: number[], userPlaySongs?: number[]) => get('/playlist/dislike', { dislikeId, resType, alg, filterIds, userPlaySongs })

/**
 * 获取独家放送列表
 * @param limit 返回数量 , 默认为 60
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*60, 其中 60 为 limit 的值 , 默认为 0
 * @returns interface PrivateContent
 */
export const getPrivateContent = (limit?: number, offset?: number): PrivateContent => get('/personalized/privatecontent/list', { limit, offset })