
import { get } from '@/utils/request';
import { CommentLike, LikeMusic, Operator } from 'i/api/api_like.d'


/**
 * 调用此接口 , 可对 MV,电台,视频，动态点赞
 * @param type 资源类型,对应以下类型
  1: mv

  4: 电台

  5: 视频

  6: 动态
 * @param t 操作,1 为点赞,其他为取消点赞
 * @param id 资源 id
 * @param threadId 动态id
 * @returns interface CommentLike
 */
export const getResourceLike = (type: number, t: number, id: string | number,threadId?:string): CommentLike => get('/resource/like', { type, t, id,threadId })

/**
 * 调用此接口 , 传入用户 id, 可获取已喜欢音乐 id 列表(id 数组)
 * @param uid 用户 id
 * @returns interface LikeMusic
 */
export const getLikeMusic = (uid: number): LikeMusic => get('/likelist', { uid })

/**
 * 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * @param id 歌曲 id
 * @param like 布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢
 * @returns interface Operator
 */
export const opeartorSong = (id: number, like?: boolean): Operator => get('/like', { id, like })

/**
 * 给评论点赞
 * @param id 资源 id, 如歌曲 id,mv id
 * @param cid 评论 id
 * @param t 是否点赞 , 1 为点赞 ,0 为取消点赞
 * @param type 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * return interface CommentLike
 0: 歌曲

 1: mv

 2: 歌单

 3: 专辑

 4: 电台

 5: 视频

 6: 动态
 * @returns 
 */
export const getCommentLike = (id: string | number, cid: number, t: number, type: number,threadId ?: string): CommentLike => get('/comment/like', { id, cid, t, type,threadId })