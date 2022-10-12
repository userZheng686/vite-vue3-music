import { ref } from 'vue'
import useVideoId from './useVideoId'
import initVideoUrlOption from "./useVideoUrl";
import useVideoRelatedRecommendList from './useVideoRelatedRecommend';
import { videoRelatedRecommendItem } from 'i/api/api_video.d'
import useVideoPraised from './useVideoPraised';
import useVideoComment from './useVideoComment'
import useVideoSubscribe from './useVideoSubscribe';
import { useVideoShare } from '@/utils/dialogShare';
import useUserFollow from './useUserFollow'
import userVideoLike from './useVideoLike'
import useVideoCollect from './useVideoCollect'
import useVideoJump from './useVideoJump'

//接口声明
import { btn, comment, userInfo, videoName, tag } from 'i/view/videoDetail.d'


//负责整个视频详情的初始化
let useInit = (elMessage: any) => {
    let currentVid = ref<string>("")
    let videoDescription = ref<string>("")
    let currentVideoImg = ref<string>("")
    //用户信息
    let userInfo = reactive<userInfo>({
        avatarUrl: "",
        nickname: "",
        followed: false,
        userId: 0,
    });
    //标题 发布时间 播放次数
    let videoName = reactive<videoName>({
        title: "",
        publishTime: 0,
        playTime: 0,
    });
    //标签
    let tag = ref<
        tag[]
    >([]);
    //视频推荐列表
    let recommendList = ref<Array<videoRelatedRecommendItem>>([]);
    //点赞收藏分享
    let btn = reactive<btn>({
        likeCount: 0,
        liked: false,
        subscribeCount: 0,
        subscribed: false,
        shareCount: 0,
    })
    //评论
    let comment = reactive<comment>({
        total: 0,
        hotComments: [],
        hotMore: false,
        comments: [],
    });
    //是否展开视频介绍
    let isShowDescription = ref<boolean>(false);

    //axios请求
    let fetch = async () => {
        if (!currentVid.value) currentVid.value = useVideoId()
        try {
            let { title, publishTime, playTime, videoGroup, creator, coverUrl, description } = await initVideoUrlOption(currentVid.value)
            //设置视频文案介绍
            videoDescription.value = description
            //初始化视频封面
            currentVideoImg.value = coverUrl
            //userInfo初始化
            Object.assign(userInfo, creator)
            //name
            Object.assign(videoName, { title, playTime, publishTime })
            //Tag
            tag.value = videoGroup
            //recommend list
            recommendList.value = await useVideoRelatedRecommendList(currentVid.value)
            //点赞
            btn = await useVideoPraised(currentVid.value, btn)
            //评论
            comment = await useVideoComment(currentVid.value, comment)
            //收藏
            useVideoSubscribe(currentVid.value, btn)
        } catch (e: any) {
            elMessage.error(e?.message || '请求失败')
        }

    }

    //关注
    let follow = (elMessage: any) => {
        return useUserFollow(userInfo, elMessage)
    }

    //视频点赞
    let likeVideo = (elMessage: any) => {
        return userVideoLike(btn, currentVid.value, elMessage)
    }

    //视频收藏
    let collectVideo = (elMessage: any) => {
        return useVideoCollect(currentVid.value, btn, elMessage)
    }

    //视频跳转
    let jumoVideo = <T>(id: number, router: T, name: string) => {
        return useVideoJump(id, router, name)
    }

    //视频分享
    let shareVideo = () => {
        return useVideoShare(currentVid.value, currentVideoImg.value, videoName.title, (res: { status: string }) => {
            if (res.status === 'success') {
                btn.shareCount++
            }
        })
    }

    //用于监听url改变 重新请求
    let flushOption = (id: string) => {
        currentVid.value = id
        fetch()
    }


    fetch()

    return {
        currentVid,
        videoDescription,
        isShowDescription,
        userInfo,
        btn,
        videoName,
        tag,
        recommendList,
        comment,
        follow,
        likeVideo,
        collectVideo,
        jumoVideo,
        shareVideo,
        flushOption
    }

}

export default useInit