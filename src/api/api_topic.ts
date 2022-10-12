import { get } from '@/utils/request'
import { HotTopic, TopicDetail, TopicDetailEvent, TopicDetailEventHot, TopicDetailRcmdList, TopicSoaring } from 'i/api/api_topic.d'

/**
 * 获取话题详情
 * @param actid  话题id
 * @returns interface TopicDetail
 */
export const getTopicDetail = (actid : number) : TopicDetail => get('/topic/detail',{actid})

/**
 * 获取话题动态
 * @param actid 话题id 
 * @param pagesize 偏移量
 * @param lasttime 用于下一次请求 类似时间戳
 * @param limit 每次请求返回的数量
 * @returns interface  TopicDetailEvent
 */
export const getTopicDetailEvent = (actid : number,pagesize : number,lasttime : number,limit ?: number) : TopicDetailEvent => get('/topic/detail/event',{actid,pagesize,lasttime,limit})

/**
 * 获取话题热门动态
 * @param actid 话题id
 * @returns interface TopicDetailEventHot
 */
export const getTopicDetailEventHot = (actid : number) : TopicDetailEventHot => get('/topic/detail/event/hot',{actid})


/**
 * 话题详情 推荐话题
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @returns interface TopicDetailRcmdList
 */
export const getTopicDetailRcmdList = (offset : number,limit : number) : TopicDetailRcmdList => get('/topic/detail/rcmd/list',{offset,limit})

/**
 * 获取热门话题
 * @param limit 取出评论数量 , 默认为 20
 * @param offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @returns interface HotTopic
 */
export const getHotTopic = (limit?: number, offset?: number): HotTopic => get('/hot/topic', { limit, offset })

/**
 * 搜索话题
 * @param search 关键词 
 * @returns 
 */
export const getTopicSearch = (search : string) => get('/topic/search', { search })

/**
 * 获取话题飙升榜
 * @param time 1 24小时 7 一周
 * @param offset 偏移量
 * @param limit 每次请求返回的数量
 * @returns interface TopicSoaring
 */
export const getTopicSoaring = (time : number,offset : number,limit : number) : TopicSoaring => get('/topic/soaring', { time, offset,limit  })