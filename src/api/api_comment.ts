
import { get } from '@/utils/request';
import { VideoComment, CommentSend, CommentHot, ResouceCommentInfo } from 'i/api/api_comment.d'

/**
 * 发送/删除评论 调用此接口,可发送评论或者删除评论
 * @param t 0删除 1 发送, 2 回复 
 * @param type 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频对应以下类型
 0: 歌曲

 1: mv

 2: 歌单

 3: 专辑

 4: 电台

 5: 视频

 6: 动态
 * @param id 对应资源 id
 * @param content 要发送的内容
 * @param commentId 回复的评论 id (回复评论时必填)
 * @returns interface CommentSend
 */
export const getCommentSend = (t: number, type: number, id: string | number, content: string, commentId?: string | number): CommentSend => get('/comment', {
    t,
    type,
    id,
    content,
    commentId
})

/**
 * 热门评论 调用此接口 , 传入 type, 资源 id 可获得对应资源热门评论 ( 不需要登录 )
 * @param id 资源 id
 * @param type 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 0: 歌曲

 1: mv

 2: 歌单

 3: 专辑

 4: 电台

 5: 视频
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface CommentHot
 */
export const getCommentHot = (id: number | string, type: number, limit?: number, offset?: number, before?: number): CommentHot => get('/comment/hot', {
    id,
    type,
    limit,
    offset,
    before
})

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 mv 的所有评论 ( 不需要 登录 )
 * @param id mv id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getMvComment = (id: number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/mv', { id, limit, offset, before })

/**
 * 暂时没用到
 * 调用此接口 , 传入资源类型和资源 id,以及排序方式,可获取对应资源的评论
 * @param id 资源 id, 如歌曲 id,mv id
 * @param type 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
  0: 歌曲

  1: mv

  2: 歌单

  3: 专辑

  4: 电台

  5: 视频

  6: 动态
 * @param pageNo 分页参数,第 N 页,默认为 1
 * @param pageSize 分页参数,每页多少条数据,默认 20
 * @param sortType 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序 
 * @param cursor 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
 * @returns 
 */
export const getCommentNew = (id: string | number, type: number, pageNo?: number, pageSize?: number, sortType?: number, cursor?: number) => get('/comment/new', {
    id,
    type,
    pageNo,
    pageSize,
    sortType,
    cursor
})

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该音乐的所有评论 ( 不需要登录 )
 * @param id 音乐 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getSongComment = (id: number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/music', { id, limit, offset, before })

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该歌单的所有评论 ( 不需要 登录 )
 * @param id 歌单 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getPlayListComment = (id: number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/playlist', { id, limit, offset, before })

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 电台节目 的所有评论 ( 不需要登录 )
 * @param id 电台节目的 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getDjComment = (id: number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/dj', { id, limit, offset, before })

/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 专辑 的所有评论 ( 不需要登录 )
 * @param id 专辑节目的 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getAlbumComment = (id: number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/album', { id, limit, offset, before })

/**
 * 调用此接口 , 传入动态 id 和 limit 参数 , 可获得该 动态 的所有评论 ( 不需要登录 )
 * @param id 动他id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @returns interface VideoComment
 */
export const getEventComment = (id: number, limit?: number, offset?: number): VideoComment => get('/comment/event', { id, limit, offset })

/**
 * 获取资源评论数量（评论 分享 等数据）
 * @param type 4 获取歌曲评论 1 获取电台节目评论 14 电台节目评论 5 mv评论 62 视频
 * @param resourceIds 资源id数组
 * @returns interface ResouceCommentInfo
 */
export const getResouceCommentInfo = (type: number, resourceIds: string): ResouceCommentInfo => get('/resource/commentInfo', { type, resourceIds })

/**
 * 
 * @param asc 升序或者降序 降序为false  升序为true 默认为false
 * @param radioId 电台id
 * @param offset 偏移量 默认为0
 * @param limit 限制获取的数量 默认为25
 * @returns 
 */
export const getResouceRadioProgramCommentInfo = (asc: boolean, radioId: number, offset?: number, limit?: number) => get('/dj/program/byradio', { radioId, asc, limit, offset })

/**
 * 视频评论 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 视频 的所有评论 ( 不需要登录 )
 * @param id 视频的 id
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @returns interface VideoComment
 */
export const getVideoComment = (id: string | number, limit?: number, offset?: number, before?: number): VideoComment => get('/comment/video', { id, limit, offset, before })