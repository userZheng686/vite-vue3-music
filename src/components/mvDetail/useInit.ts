import { ref, reactive, watch } from 'vue'
import useMvId from './useMvId'
import initMvUrlOption from './useMvUrl'
// import useMvSimiList from './useMvSimi'
import useMvInfo from './useMvInfo'
import useMvComment from './useMvComment'
// import useUserFollow from './useUserFollow'
import userMvLike from './userMvLike'
import useMvCollect from './useMvCollect'
import { useMvShare } from '@/utils/dialogShare'
import useDownloadMV from './useDownloadMV'
//相关视频推荐
import useVideoRelatedRecommendList from '../videoDetail/useVideoRelatedRecommend';
//接口声明
import { MvDetailItemArtists } from 'i/api/api_mv.d'
import { mvName, btn, comment } from 'i/view/mvDetail.d'
import { SimiMvItem } from 'i/api/api_mv.d'
import { videoRelatedRecommendItem } from 'i/api/api_video.d'
import { loginCallback } from '@/utils/login'


//初始化整个视频详情
let useInit = (elMessage: any) => {
    //当前mvid
    let currentMvid = ref<number>(0)
    //mv文案
    let mvDescription = ref<string>("")
    //mv封面
    let currentMvImg = ref<string>("")
    //用户信息
    let userInfo = ref<MvDetailItemArtists[]>([{
        img1v1Url: "",
        name: "",
        followed: false,
        id: 0,
    }]);
    //标题 发布时间 播放次数
    let mvName = reactive<mvName>({
        name: "",
        publishTime: "",
        playCount: 0,
    });
    //视频推荐列表
    let simiList = ref<Array<videoRelatedRecommendItem>>([]);
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
    let downloadUrlParam: string[]
    //下载进度
    let progress = ref<number>(0)
    //是否在下载了
    let isDownload = ref<boolean>(false)
    //是否已经下载完毕
    let isCompleteDownload = ref<boolean>(false)

    //axios请求
    let fetch = async () => {
        if (currentMvid.value === 0) currentMvid.value = useMvId()
        try {
            let { artists,
                cover,
                desc,
                duration,
                id,
                downloadStatus,
                subCount,
                name,
                playCount,
                publishTime,
                subed,
                urlParam } = await initMvUrlOption(currentMvid.value)

            //设置文案
            mvDescription.value = desc

            //设置mv封面
            currentMvImg.value = cover



            //设置用户信息
            userInfo.value = artists
            // Object.assign(userInfo, artists[0])

            //设置标题 发布时间  播放次数
            mvName.name = name
            mvName.publishTime = publishTime
            mvName.playCount = playCount

            //相似mv

            simiList.value = await useVideoRelatedRecommendList(currentMvid.value)

            //非常尴尬 写完了发现弄错了 先暂时留着吧 万一要用呢？
            // simiList.value = await useMvSimiList(currentMvid.value)

            //mv点赞转发数据
            btn = await useMvInfo(currentMvid.value, btn)

            //mv评论
            comment = await useMvComment(currentMvid.value, comment)

            //是否收藏
            btn.subscribed = subed
            btn.subscribeCount = subCount

            //下载链接
            downloadUrlParam = urlParam

            //是否已经下载完毕
            isCompleteDownload.value = downloadStatus
        } catch (e: any) {
            elMessage.error(e?.message || '请求mv详情失败 请检查你的网络是否有问题?')
        }
    }

    fetch()

    //关注
    // let follow = (elMessage: any) => {
    //     return useUserFollow(userInfo, elMessage)
    // }

    //视频点赞
    let likeVideo = (elMessage: any) => {
        return userMvLike(btn, currentMvid.value, elMessage)
    }

    //视频收藏
    let collectVideo = (elMessage: any) => {
        return loginCallback(() => {
            useMvCollect(currentMvid.value, btn, elMessage)
        })
    }

    //视频分享
    let shareVideo = () => {
        return useMvShare(currentMvid.value, currentMvImg.value, mvName.name, ((res: { status: string }) => {
            if (res.status === 'success') {
                btn.shareCount++
            }
        }))
    }

    //用于监听url改变 重新请求
    let flushOption = (id: number) => {
        currentMvid.value = id
        fetch()
    }

    //下载MV
    let downloadMv = () => {
        let fileName = ''
        userInfo.value.forEach((item, index) => {
            if (index !== userInfo.value.length - 1) {
                fileName += item.name + ','
            } else {
                fileName += item.name
            }
        })
        fileName += ' - ' + mvName.name + '.mp4'
        let item = {
            name: mvName.name,
            fileName,
            mvId: currentMvid.value,
            cover: currentMvImg.value,
            userInfo: userInfo.value,
            currentProgress: progress.value,
            downloadStatus: 'begin',
            downloadReceivedBytes: 0,
            downloadUrl: downloadUrlParam[0],
            videoParam: ['', 'video/mp4', downloadUrlParam[2]]
        }
        //标志 正在下载
        isDownload.value = true
        return useDownloadMV(downloadUrlParam[0], item, progress, isDownload)
    }

    return {
        currentMvid,
        mvDescription,
        currentMvImg,
        userInfo,
        mvName,
        simiList,
        progress,
        isDownload,
        isCompleteDownload,
        btn,
        comment,
        isShowDescription,
        // follow,
        likeVideo,
        collectVideo,
        shareVideo,
        flushOption,
        downloadMv
    }
}


export default useInit