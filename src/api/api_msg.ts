import { get } from '@/utils/request';

/**
 * 获取最近联系人
 * @returns 
 */
export const getRecentlyContact = () => get('/msg/recentcontact')