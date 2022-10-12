import { getMvComment } from '@/api/api_comment'
import { comment } from 'i/view/videoDetail.d';

//获取mv评论
let useMvComment = (mvid: number, comment: comment): Promise<comment> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { comments, hotComments, total } = await getMvComment(mvid)
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
                message: e?.message || '请求MV评论列表出错，请检查你的网络是否有问题?'
            }
            reject(error)
        }
    })
}

export default useMvComment