import { get } from '@/utils/request'
import { key, qrCode, loginResult, loginPhone, signinErr, UserFollows, UserSub, Status, sendCode, checkSendCode, UsersBatch, UserDj, UserFolloweds, UserFriendNoticeSong, UserFollowRecommend, UserFollowRecommendCount, UserRecommendCelebrities, UserDetail } from 'i/api/api_user.d'

/**
 * 生成二维码Key
 * @returns interface key
 */
export const generateKey = (): key => get('/login/qr/key')

/**
 * 生成二维码
 * @param key key,由第一个接口生成
 * @param qrimg 传入后会额外返回二维码图片 base64 编码
 * @returns interface qrCode
 */
export const generateQrCode = (key: string): qrCode => get('/login/qr/create', { key })

/**
 * 轮询查询是否扫码(二维码检测扫码状态接口)
 * @param key key,由第一个接口生成(generateKey)
 * @returns interface loginResult
 */
export const ScanQrCode = (key: string): loginResult => get('/login/qr/check', { key })

/**
 * 获取验证码
 * @param phone 手机号码
 * @param ctcode 国家区号,默认 86 即中国
 * @returns interface sendCode
 */
export const userCode = (phone: number, ctcode?: number): sendCode => get('/captcha/sent', { phone, ctcode })

/**
 * 调用此接口 ,传入手机号码和验证码, 可校验验证码是否正确
 * @param phone 手机号码
 * @param captcha 验证码
 * @param ctcode 国家区号,默认 86 即中国
 * @returns interface checkSendCode
 */
export const checkUserCode = (phone: number, captcha: number, ctcode?: number): checkSendCode => get('/captcha/verify', { phone, captcha, ctcode })

/**登录 */

export const userEmailLogin = (email: string, password?: string, md5_password?: string) => get('/login', { email, password, md5_password })

/**
 * 
 * @param params phone 手机号码 password 密码 countrycode: 国家码，用于国外手机号登录，例如美国传入：1
 md5_password: md5 加密后的密码,传入后 password 参数将失效 
 captcha: 验证码,使用 /captcha/sent接口传入手机号获取验证码,调用此接口传入验证码,可使用验证码登录,传入后 password 参数将失效
 * @returns interface loginResult
 */
export const userLogin = (params: loginPhone): loginResult => get('/login/cellphone', params)

/**
 * 调用此接口,可获取登录状态
 * @returns interface Status
 */
export const userStatus = (): Status => get('/login/status', {})

/**
 * 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * @param uid 用户 id
 * @returns interface UserDetail
 */
export const userDetail = (uid: number) : UserDetail => get('/user/detail', { uid })

/**
 * 签到 调用此接口 , 传入签到类型 ( 可不传 , 默认安卓端签到 ), 可签到 ( 需要登录 ), 其中安卓端签到可获得 3 点经验 , web/PC 端签到可获得 2 点经验
 * @param type 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 * @returns interface signinErr
 */
export const userSignin = (): signinErr => get('/daily_signin', { type: 1 })

/**
 * 获取用户关注列表 登录后调用此接口 , 传入用户 id, 可以获取用户关注列表
 * @param uid 用户 id
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns 
 */
export const getUserFollows = (uid: number, limit?: number, offset?: number): UserFollows => get('/user/follows', { uid, limit, offset })


/**
 * 获取用户粉丝列表 登录后调用此接口 , 传入用户 id, 可以获取用户关注列表
 * @param uid 用户 id
 * @param limit 返回数量 , 默认为 30
 * @param offset 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @returns 
 */
export const getUserFolloweds = (uid: number, limit?: number, offset?: number): UserFolloweds => get('/user/followeds', { uid, limit, offset })



/**
 * 关注/取消关注用户 登录后调用此接口 , 传入用户 id, 和操作 t,可关注/取消关注用户
 * @param id 用户 id
 * @param t 1为关注,其他为取消关注
 * @returns 
 */
export const getFollow = (id: number, t: number) => get('/follow', { id, t })

/**
 * 登录后调用此接口 , 可以获取用户信息 (获取用户信息 , 歌单，收藏，mv, dj 数量)
 * @returns interface UserSub
 */
export const getUserSub = (): UserSub => get('/user/subcount', {})

/**
 * 获取用户主页详情
 * @param userId 用户id
 * @returns interface UsersBatch
 */
export const getUsersBatch = (userId: number): UsersBatch => get('/users/batch', { userId })

/**
 * 获取用户收藏或者创建的电台
 * @param userId 用户id
 * @returns interface UserDj
 */
export const getUserDj = (userId: number): UserDj => get('/dj/create/sub', { userId })

/**
 * 更新用户信息 登录后调用此接口 , 传入相关信息,可以更新用户信息
 * @param userInfo 
 gender: 性别 0:保密 1:男性 2:女性

 birthday: 出生日期,时间戳 unix timestamp

 nickname: 用户昵称

 province: 省份id

 city: 城市id

 signature：用户签名
 * @returns 
 */
export const updateUserInfo = (userInfo: { gender: number, birthday: number, nickname: string, province: number, city: number, signature: string }) => get('/user/update', userInfo)


/**
 * 获取新歌通知
 * @returns interface UserFriendNoticeSong
 */
export const getUserFriendNoticeSong = (time : number) : UserFriendNoticeSong => get('/user/friend/notice/song',{time})

/**
 * 获取推荐关注
 * @returns interface UserFollowRecommendCount
 */
export const getUserFollowRecommendCount = () : UserFollowRecommendCount => get('/user/follow/recommend/count',{})


/**
 * 微博 推荐关注
 * @param starNum 开始位置 
 * @param snsNum 返回的数量
 * @param filterUserIds 过滤的用户id
 * @returns interface UserFollowRecommend
 */
export const getUserFollowRecommend = (starNum : number,snsNum : number,filterUserIds ?: string) : UserFollowRecommend => get('/user/follow/recommend',{starNum,snsNum,filterUserIds})

/**
 * 刷新登录
 * @returns 
 */
export async function refreshLogin() {
    let res = await get('/login/refresh')
    return res
}