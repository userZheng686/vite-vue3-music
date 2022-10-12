import { get } from '@/utils/request';
import { NewMv, TopMv, MvDetail, MvUrl, SimiMv, MvDetailInfo, ArtistMV, SubMV } from 'i/api/api_mv.d'

/**
 * 调用此接口 , 可获取全部 mv
 * @param area 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 
 * @param type 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param order 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param limit 取出数量 , 默认为 30
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * @returns interface NewMv
 */
export const getAllMv = (area?: string, type?: string, order?: string, limit?: number, offset?: number): NewMv => get('/mv/all', {
    area, type, order, limit, offset
})

/**
 * 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * @param id  mv id
 * @param r 分辨率,默认 1080,可从 /mv/detail 接口获取分辨率列表
 * @returns interface MvUrl
 */
export const getMvUrl = (id: number, r: number): MvUrl => get('/mv/url', { id, r })

/**
 * 调用此接口,可获取收藏的 MV 列表
 * @returns interface SubMV
 */
export const getSubMV = () : SubMV => get('/mv/sublist',{})

/**
 * 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 * @param mvid mv 的 id
 * @returns interface MvDetail
 */
export const getMvDetail = (mvid: number): MvDetail => get('/mv/detail', { mvid })

/**
 * 调用此接口 , 可获取 mv 排行
 * @param limit 取出数量 , 默认为 30
 * @param area 地区,可选值为内地,港台,欧美,日本,韩国,不填则为全部
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 * @returns interface TopMv
 */
export const getTopMv = (limit?: number, area?: string, offset?: number): TopMv => get('/top/mv', { limit, area, offset })

/**
 * 调用此接口 , 传入 mvid 可获取相似 mv
 * @param mvid mv id
 * @returns interface SimiMv
 */
export const getSimiMv = (mvid: number): SimiMv => get('/simi/mv', { mvid })

/**
 * 获取歌手mv 
 * @param id 歌手id
 * @param offset 偏移量
 * @param limit 返回的数量
 * @returns interface ArtistMV
 */
export const getArtistMV = (id : number,offset : number,limit : number) : ArtistMV => get('/artist/mv', { id, offset, limit}) 

/**
 * 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
 * @param mvid mv 的 id
 * @returns interface MvDetailInfo 
 */
export const getMvDetailInfo = (mvid: number): MvDetailInfo => get('/mv/detail/info', { mvid })

/**
 * 最新 mv 调用此接口 , 可获取最新 mv
 * @param area 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param limit 取出数量 , 默认为 30
 * @returns interface NewMv
 */
export const getNewMv = (area?: string, limit?: number): NewMv => get('/mv/first', { area, limit })