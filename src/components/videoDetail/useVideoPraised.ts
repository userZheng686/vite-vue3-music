import { getVideoDetailInfo } from "@/api/api_video";
import { btn } from 'i/view/videoDetail.d'


//获取当前视频点赞数量 是否点赞 评论数 分享数量
const useVideoPraised = (vid: string, btn: btn): Promise<btn> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { likedCount, shareCount, liked } = await getVideoDetailInfo(vid);
            btn.likeCount = likedCount;
            btn.liked = liked;
            btn.shareCount = shareCount;
            resolve(btn)
        } catch (e: any) {
            let error = {
                message: e?.message || "请求视频点赞失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })
}


export default useVideoPraised