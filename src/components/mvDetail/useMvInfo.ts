import { getMvDetailInfo } from '@/api/api_mv'
import { btn } from 'i/view/mvDetail.d'

/**获取点赞转发数据 */
let useMvInfo = (mvid: number, btn: btn): Promise<btn> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { likedCount, shareCount, liked } = await getMvDetailInfo(mvid)
            btn.likeCount = likedCount;
            btn.liked = liked;
            btn.shareCount = shareCount;
            resolve(btn)
        } catch (e: any) {
            let error = {
                message: e?.message || "请求MV点赞详情失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })
}

export default useMvInfo