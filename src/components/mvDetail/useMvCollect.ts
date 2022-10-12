import { btn } from 'i/view/mvDetail'
import { getCollectMv } from './../../api/api_collect';


//收藏视频
const useMvCollect = async (currentMvid: number, btn: btn, elMessage: any) => {
    try {
        let res = await getCollectMv(currentMvid, btn.subscribed ? 0 : 1);
        if (res.code === 200) {
            btn.subscribed = !btn.subscribed;
            if (btn.subscribed) {
                elMessage.success("收藏成功");
            } else {
                elMessage.success("取消收藏成功");
            }
            if (btn.subscribed === false) {
                btn.subscribeCount--;
            } else {
                btn.subscribeCount++;
            }
        }
    } catch (e: any) {
        elMessage.error(e?.message || "收藏视频失败 请检查你的网络是否有问题?");
    }
};

export default useMvCollect