import { get } from '@/utils/request';
import { RecommendMV, VideoCategory, CategoryVideoList, VideoDetail, VideoDetailSubscribe, videoRelatedRecommend, VideoDetailInfo, VideoUrl, VideoTag, VideoSubList } from 'i/api/api_video.d';

/**
 * 推荐 mv
 * @returns interface RecommendMV
 */
export const getRecommendMV = (): RecommendMV => get('/personalized/mv')

/**
 * 获取视频标签列表
 * @returns interface VideoTag
 */
export const getVideoTag = (): VideoTag => get('/video/group/list')

/**
 * 获取视频分类列表
 * @returns interface RecommendMV
 */
export const getVideoCategory = (): VideoCategory => get('/video/category/list')

/**
 * 获取视频详情
 * @param vid  视频 的 id
 * @returns interface VideoDetail
 */
export const getVideoDetail = (id: string): VideoDetail => get('/video/detail', { id });

/**
 * 获取视频点赞转发评论数数据
 * @param vid 调用此接口 , 传入 vid ( 视频 id ) , 可获取对应视频点赞转发评论数数据
 * @returns interface VideoDetailInfo
 */
export const getVideoDetailInfo = (vid: string): VideoDetailInfo => get('/video/detail/info', { vid });

/**
 * 视频收藏数量 点赞数量 播放次数 是否收藏
 * @param vid 调用此接口 , 传入 vid ( 视频 id ) , 可获取对应视频收藏数量 点赞数量 播放次数 是否收藏
 * @returns interface VideoDetailSubscribe
 */
export const getVideoDetailSubscribe = (id: string): VideoDetailSubscribe => get('/video/statistic', { id });

/**
 * 获取视频播放地址 调用此接口 , 传入视频 id,可获取视频播放地址
 * @param id 视频 的 id
 * @param res 视频 的 清晰度
 * @returns interface VideoUrl
 */
export const getVideoUrl = (id: string, res?: number): VideoUrl => get('/video/url', { id, res })

/**
 * 相关视频
 * @param id 视频 的 id
 * @returns interface videoRelatedRecommendItem
 */
export const getvideoRelatedRecommend = (id: string | number): videoRelatedRecommend => get('/related/allvideo', { id })

/**
 * 获取用户收藏视频列表
 * @param limit 每次返回的数据数量 默认25
 * @param offset 偏移数量，用于分页
 * @returns interface VideoSubList
 */
export const getVideoSubList = (limit: number, offset: number): VideoSubList => get('/video/sublist', { limit, offset })

/**
 * 获取视频标签/分类下的视频 调用此接口传入标签/分类id,可获取到相关的视频,分页参数只能传入 offset
 * @param id videoGroup 的 id
 * @param offset 默认 0
 * @returns interface CategoryVideoList
 */
export const getVideoGroup = (offset: number, groupId: number): CategoryVideoList => get('/video/group', { offset, groupId })

/**
 * 视频不感兴趣
 * @param id 视频id
 * @param type 类型
 * @returns 
 */
export const dislikeVideo = (id : string,type : number) => get('/videotimeline/rejectrcmd',{id,type})

/**
 * 获取视频分类下面的视频列表 调用此接口,可获取视频分类列表
 * @param offset : 偏移量默认 0;
 * @param groupId : 默认 0;
 * @returns interface CategoryVideoList
 */
export const getVideoAll = (offset: number, groupId: number): CategoryVideoList => get('/video/timeline/all', { offset, groupId })