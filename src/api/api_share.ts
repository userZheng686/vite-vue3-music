import { get } from '@/utils/request'
import { ShareResource } from 'i/api/api_share.d'

/**
 * 分享文本、歌曲、歌单、mv、电台、电台节目到动态
 * @param id 资源 id （歌曲，歌单，mv，专辑，电台，歌手，电台节目,視頻对应 id）
 * @param type 资源类型，默认歌曲 song，可传 song,playlist,mv,djradio,album,djprogram,cloudvideo,artist
 * @param msg 内容，140 字限制，支持 emoji，@用户名（/user/follows接口获取的用户名，用户名后和内容应该有空格），图片暂不支持
 * @returns 
 */
export const getShareResource = (id: string | number, type?: string, msg?: string): ShareResource => get('/share/resource', { id, type, msg })