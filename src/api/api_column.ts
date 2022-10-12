import { get } from '@/utils/request'
import { ColumnCreateList, ColumnSubList } from "i/api/api_column.d"

/**
 * 获取用户收藏的专栏
 * @param limit 取出评论数量 , 默认为 50
 * @param offset 偏移量
 * @returns interface ColumnSubList
 */
export const getColumnSubList = (limit: number, offset: number) : ColumnSubList => get('/topic/sublist', { limit, offset })

/**
 * 获取用户创建的专栏
 * @param userId 用户id
 * @param offset 偏移量
 * @param limit 返回的数量
 * @returns interface ColumnCreateList
 */
export const getColumnCreateList = (userId : number,offset : number,limit : number) : ColumnCreateList => get('/user/topic/series',{userId,offset,limit})
