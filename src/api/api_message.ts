import { get } from '@/utils/request';
import { MsgComments, MsgForwards, MsgNotices, PrivateMessage, PrivateMsg, PrivateMsgHistory, Result, sendType } from 'i/api/api_message.d'

/**
 * 登录后调用此接口 ,可获取私信
 * @param limit 返回数量 , 默认为 30 
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns interface PrivateMsg
 */
export const getPrivateMsg = (limit: number, offset: number) : PrivateMsg => get('/msg/private', { limit, offset }) 


/**
 * 登录后调用此接口 ,可获取评论
 * @param uid 用户 的 id，只能和登录账号的 id 一致
 * @param limit 返回数量 , 默认为 30
 * @param before 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 * @returns interface MsgComments
 */
export const getMsgComments = (uid : number,limit : number,before : number) : MsgComments => get('/msg/comments',{uid,limit,before})

/**
 * 登录后调用此接口 ,可获取@我数据
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns interface MsgForwards
 */
export const getMsgForwards = (limit : number,offset : number,time : number,total:string) : MsgForwards => get('/msg/forwards',{limit,offset,time,total})

/**
 * 登录后调用此接口 ,可获取通知
 * @param limit 返回数量 , 默认为 30
 * @param lasttime 返回数据的 time ,默认-1,传入上一次返回结果的 time,将会返回下一页的数据
 * @returns interface MsgNotices
 */
export const getMsgNotices = (limit : number,lasttime : number) : MsgNotices  => get('/msg/notices',{limit,lasttime})


/**
 * 删除通知
 * @param id 通知id
 * @returns 
 */
export const deletePrivateNotice = (id : number) => get('/msg/notice/delete',{id})

/**
 * 清空所有消息提醒
 * @returns 
 */
export const clearMsgCount = () => get('/msg/count/clear')

/**
 * 删除私信
 * @param uid 用户 id
 * @returns 
 */
export const deletePrivateMsg = (userId : number) => get('/msg/private/delete',{userId})

/**
 * 删除私信单条记录
 * @param id 私信id
 * @returns 
 */
export const deletePrivateMsgSingle = (id : number) => get('/msg/private/delete/single',{id})

/**
 * 登录后调用此接口 , 可获取私信内容
 * @param uid 用户 id
 * @param nickname 用户名称
 * @param offset 偏移量
 * @param limit 返回数量 , 默认为 30
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据
 * @returns interface PrivateMsgHistory
 */
export const getPrivateMsgHistory = (uid : number,nickname : string,offset : number,limit : number,before : number) : PrivateMsgHistory => get('/msg/private/history',{uid,nickname,offset,limit,before})

/**
 * 发送私信 登录后调用此接口 , 传入用户 id 和要发送的信息, 可以发送私信,返回内容为历史私信,包含带歌单的私信信息(注:不能发送私信给自己)
 * @param user_ids 用户 id,多个需用逗号隔开
 * @param msg 要发送的信息
 * @returns interface PrivateMessage
 */
export const sendPrivateMessage = (user_ids : string,msg : string) : PrivateMessage => get('/send/text',{user_ids,msg})


/**
 * 发送私信 登录后调用此接口
 * @param id 要分享的资源id
 * @param type 要分享的资源类型
 * @param userIds 要分享给的用户id数组
 * @param msg 要分享的信息
 * @returns interface Result
 */
export const setPrivateLetter = (id: number | string, type: sendType, userIds: number[], msg: string): Result => get('/send/custom', { id, type, userIds, msg })

