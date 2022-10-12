import { getVideoComment } from "@/api/api_comment";
import { comment } from "i/view/videoDetail.d";

//获取当前视频评论
const useVideoComment = (vid: string, comment: comment): Promise<comment> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { comments, hotComments, total } = await getVideoComment(vid);
            comment.total = total;
            comment.comments = comments;
            if (hotComments.length > 10) {
                comment.hotComments = hotComments.slice(0, 10);
                comment.hotMore = true;
            } else {
                comment.hotComments = hotComments;
            }
            resolve(comment)
        } catch (e: any) {
            let error = {
                message: e?.message || "请求视频评论失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })

};

export default useVideoComment