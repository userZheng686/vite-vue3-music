import { PlCount } from 'i/api/api_count';
import { get } from '@/utils/request';

/**通知（收到了多少条消息 包括私信 通知 评论） */
export const getPlCount = () : PlCount => get('/pl/count',{})