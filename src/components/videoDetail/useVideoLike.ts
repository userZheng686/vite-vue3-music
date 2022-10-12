
import { getResourceLike } from "@/api/api_like";
//接口声明
import { btn } from 'i/view/videoDetail'

//给视频点赞
const userVideoLike = async (btn: btn, currentVid: string, elMessage: any) => {
    try {
        let res = await getResourceLike(5, btn.liked ? 0 : 1, currentVid);
        if (res?.code === 200) {
            btn.liked = !btn.liked;
            if (btn.liked) {
                elMessage.success("点赞成功");
            } else {
                elMessage.success("取消点赞成功");
            }
            if (btn.liked === false) {
                btn.likeCount--;
            } else {
                btn.likeCount++;
            }
        }
    } catch (e: any) {
        elMessage.error(e?.message || "点赞视频失败 请检查你的网络是否有问题?");
    }
};

export default userVideoLike