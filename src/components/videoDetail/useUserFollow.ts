import { getFollow } from "@/api/api_user";
import { userInfo } from 'i/view/videoDetail'
//关注别人
const useUserFollow = async (userInfo: userInfo, elMessage: any) => {
    try {
        let { code } = await getFollow(userInfo.userId, userInfo.followed ? 0 : 1);
        if (code === 200) {
            elMessage.success("关注成功");
            userInfo.followed = true;
        }
    } catch (e: any) {
        //这里返回的参数好像都不太一致 只能先选个定义了
        if (e?.data?.blockText) {
            elMessage.error(
                e?.data?.blockText || `${userInfo.followed ? "取消关注" : "关注"}失败`
            );
        } else {
            elMessage.error(
                e?.message ||
                `${userInfo.followed ? "取消关注" : "关注"
                }失败 请检查你的网络是否有问题?`
            );
        }
    }
};

export default useUserFollow