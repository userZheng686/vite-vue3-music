import { getVideoDetailSubscribe } from "@/api/api_video";

interface btn {
    subscribeCount: number;
    subscribed: boolean;
}

//获取视频收藏
const useVideoSubscribe = (vid: string, btn: btn) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                data: { subscribed, subscribeCount },
            } = await getVideoDetailSubscribe(vid);
            btn.subscribeCount = subscribeCount;
            btn.subscribed = subscribed;
            resolve(btn)
            // ("收藏", res);
        } catch (e: any) {
            let error = {
                message: e?.message || "请求视频收藏失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })

};

export default useVideoSubscribe