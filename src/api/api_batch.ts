import { get } from '@/utils/request'
import { HomeBatch } from 'i/api/api_batch.d'

/**
 * 获取首页数据（个性推荐）
 interface HomeBatch
 */
export const getHomeBatch = (): HomeBatch => get('/home/batch')
