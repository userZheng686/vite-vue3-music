import { EventHistory, UserEven, UserEventDetail } from 'i/api/api_event'
import { get } from '@/utils/request'

/**
 * 转发动态
 * @param forwards 转发的内容
 * @param evId 转发的资源id
 * @param uid 用户id
 * @returns 
 */
export const eventShare = (forwards : string,id : number,eventUserId : number) => get('/event/forward',{forwards,id,eventUserId})

/**
 * 获取动态历史记录
 * @param cursor : 请求的时间戳;
 * @returns interface EventHistory
 */
export const getEventHistory = (cursor : number | string) : EventHistory =>  get('/history/feed/get',{cursor})

/**
 * 请求用户动态数据
 * @param uid 用户id
 * @param offset 偏移量
 * @param time 时间 用于下次请求调用
 * @param limit 每次请求返回的数量
 * @returns interface UserEven
 */
export const getUserEvent = (uid : number,offset : number,time : number,limit : number) : UserEven => get('/user/event',{uid,offset,time,limit})

/**
 * 删除用户动态
 * @param evId 动态id
 * @returns 
 */
export const delUserEvent = (evId : number) => get('/event/del',{evId})

/**
 * 获取用户动态详情
 * @param uid 用户id
 * @param id 动态id
 * @returns interface UserEventDetail
 */
export const getUserEventDetail = (uid : number,id : number) : UserEventDetail => get('/user/event/detail',{uid,id})