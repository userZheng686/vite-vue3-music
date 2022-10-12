import {
    getvideoRelatedRecommend
} from "@/api/api_video";
import { videoRelatedRecommendItem } from 'i/api/api_video.d'


let useVideoRelatedRecommendList = (vid: string | number): Promise<videoRelatedRecommendItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await getvideoRelatedRecommend(vid)
            resolve(data)
        } catch (e: any) {
            let error = {
                message: e?.message || "请求推荐视频列表失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })

}


export default useVideoRelatedRecommendList