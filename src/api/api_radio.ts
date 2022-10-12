import { get } from '@/utils/request'
import { HotTypeRadio, SecondTypeRadio, PersonRadioRecommend, TypeRadio, RadioBatch, RadioSublist, RadioDJDetail, RadioProgramDetail, RadioVoice, RadioFM, RadioScene, Subscribers, ProgramDetail } from "i/api/api_radio.d";



/**
 * 电台分类
 * @returns interface TypeRadio
 */
export const getTypeRadio = (): TypeRadio => get('/dj/catelist')



/**
 * 获取播客列表（客户端）
 * @returns interface RadioVoice
 */
export const getRadioVoice = (cursor: string): RadioVoice => get('/dj/voice', { cursor })


/**
 * 播客 批量请求接口 请求热门分类和二级分类
 * @param hot 热门列表
 * @param second 二级分类
 * @returns RadioBatch
 */
export const getRadioBatch = (hot: {
    cateId: number,
    limit: number,
    offset: number,
}, second: {
    categoryId: number,
}): RadioBatch => get('/dj/batch', { hot, second })

/**
 * 获取播客列表（客户端）（FM）
 * @returns interface RadioFM
 */
export const getRadioVoiceFM = (): RadioFM => get('/dj/voice/fm')

/**
 * 根据id获取播客FM
 * @returns interface RadioScene
 */
export const getRadioVoiceScene = (sceneId: string): RadioScene => get('/dj/voice/scene', { sceneId })

/**
 * 电台 类别热门电台
 * @param limit  返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param cateId 类别 id,可通过 /dj/category/recommend 接口获取
 * @returns interface HotTypeRadio
 */
export const getHotTypeRadio = (limit?: number, offset?: number, cateId?: number): HotTypeRadio => get('/dj/radio/hot', { limit, offset, cateId })

/**
 * 电台 二级分类电台
 * @param categoryId 电台分类的id
 * @param limit 限制返回多少数量
 * @param offset 偏移数量，用于分页
 * @param total 是否需要全部数据
 * @returns interface SecondTypeRadio
 */
export const getSecondTypeRadio = (categoryId: number, limit: number, offset: number, total: string): SecondTypeRadio => get('/dj/category/second', { categoryId, limit, offset, total })



/**
 * 电台 - 节目 登录后调用此接口 , 传入rid, 可查看对应电台的电台节目以及对应的 id
 * @param rid  电台 的 id
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param asc 排序方式,默认为 false (新 => 老 ) 设置 true 可改为 老 => 新
 * @returns 
 */
export const getRadioProgram = (rid: number, limit?: number, offset?: number, asc?: boolean) => get('/dj/program', { rid, limit, offset, asc })

/**
 * 获取用户创建的播客
 * @param userId 用户id
 * @param offset 偏移量
 * @param limit 返回的数量
 * @returns interface RadioSublist
 */
export const getUserCreateDj = (userId : number,offset : number,limit : number) : RadioSublist => get('/user/createDj',{userId,offset,limit})


/**
 * 电台的订阅列表 登录后调用此接口 , 可获取订阅的电台列表
 * uid 用户id
 * offset 偏移量
 * limit 返回的数量
 * @returns interface RadioSublist
 */
export const getRadioSublist = (uid : number,offset: number,limit : number,time ?: number): RadioSublist => get('/dj/sublist', {uid, limit, offset,time})

/**
 * 清除电台通知
 * @returns 
 */
export const clearRadioCount = () => get('/dj/count/clear')

/**
 * 电台 - 详情 登录后调用此接口 , 传入rid, 可获得对应电台的详情介绍
 * @param rid 电台 的 id
 * @returns interface RadioDJDetail
 */
export const getRadioDJDetail = (rid: number): RadioDJDetail => get('/dj/detail', { rid })

/**
 * 关注/取消关注 电台
 * @param rid 电台 的 id
 * @param t 1 关注 2 取消关注
 * @returns 
 */
export const RadioSub = (rid: number, t: number): { code: number } => get('/dj/sub', { rid, t })

/**
 * 电台节目详情
 * @param id 电台节目 的 id
 * @returns interface ProgramDetail
 */
export const getProgramDetail = (id: number): ProgramDetail => get('/dj/program/detail', { id })

/**
 * 更新电台收听次数
 * @param id 电台id
 * @returns 
 */
export const updateRadioListenCount = (id: number) => get('/dj/program/listen', { id })

/**
 * 更新电台节目播放次数
 * @param isListened 是否收听过了
 * @param listenLocation 目前的收听次数
 * @param programId 节目id
 * @returns 
 */
export const updateProgramListenCount = (isListened: boolean, listenLocation: number, programId: number): { code: number, message: string } => get('/record/upload', { isListened, listenLocation, programId })

/**
 * 电台 获取电台订阅者
 * @param time 时间
 * @param limit 每次返回的数据数量
 * @param offset 偏移量
 * @param id 电台id
 * @returns interface RadioSubscribers
 */
export const getRadioSubscribers = (time: number, limit: number, offset: number, id: number): Subscribers => get('/dj/subscriber', { time, limit, offset, id })

/**
 * 登录后调用此接口 , 传入rid, 可查看对应电台的电台节目以及对应的 id, 需要 注意的是这个接口返回的 mp3Url 已经无效 , 都为 null, 但是通过调用 /song/url 这 个接口 , 传入节目 id 仍然能获取到节目音频 , 如 /song/url?id=478446370 获取代 码时间的一个节目的音频
 * @param rid 电台 的 id
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param asc 排序方式,默认为 false (新 => 老 ) 设置 true 可改为 老 => 新
 * @returns interface RadioProgramDetail
 */
export const getRadioProgramDetail = (rid: number, limit?: number, offset?: number, asc?: boolean): RadioProgramDetail => get('/dj/program', { rid, limit, offset, asc })

