import emitter from "@/utils/eventBus";
import {
    getVideoUrl,
    getVideoDetail,
} from "@/api/api_video";
import {
    VideoDetailVideoGroupItem,
    VideoUrl,
    VideoDetailResolutionsItem
} from "i/api/api_video.d";
import { CreatorType } from 'i/api/api_playList.d'

interface res {
    videoGroup: VideoDetailVideoGroupItem[];
    title: string;
    publishTime: number;
    playTime: number;
    creator: CreatorType;
    coverUrl: string;
    description: string;
}

//清晰度
let definition = 0

//初始化整个url配置
let initVideoUrlOption = async (vid: string): Promise<res> => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await getVideoDetail(vid);
            let {
                data: {
                    width,
                    height,
                    videoGroup,
                    title,
                    publishTime,
                    resolutions,
                    playTime,
                    creator,
                    coverUrl,
                    description
                },
            } = res;

            //视频清晰度和url绑定 传到control组件上 这里另外写个函数处理
            let normAlizeVideoUrl = await settingVideoGroupURL(resolutions, vid);
            //这里将默认播放的清晰度和视频url链接一起拼接 传给control组件
            let normAlizeVideoOptions = {
                normAlizeVideoUrl,
                width,
                height,
                definition,
            };
            emitter.emit("videoOptions", normAlizeVideoOptions);
            resolve({
                videoGroup,
                title,
                publishTime,
                playTime,
                creator,
                coverUrl,
                description
            })
        } catch (e: any) {
            let error = {
                message: e?.message || "请求视频详情失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })

}

//设置清晰度和对应的url
let settingVideoGroupURL = async (
    group: VideoDetailResolutionsItem[],
    vid: string
): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        let videoPromise: Promise<VideoUrl>[] = [];
        let videoUrl: string[][] = [];
        group.forEach((item) => {
            let promise = getCurrentVideoUrl(vid, item.resolution);
            videoPromise.push(promise);
        });

        Promise.allSettled(videoPromise)
            .then((res) => {
                res.forEach((item, index) => {
                    if (item.status === "fulfilled") {
                        let {
                            value: { urls },
                        } = item;
                        let { url, r } = urls[0];
                        normalizeVideoOption(videoUrl, url, r, index);
                    }
                });
                resolve(videoUrl);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

/**标准化处理url*/
let normalizeVideoOption = (
    videoUrl: string[][],
    url: string,
    r: number,
    index: number
): string[][] => {
    let resolution = "";
    if (r === 240) {
        resolution = "流畅";
    } else if (r === 480) {
        resolution = "标清";
    } else if (r === 720) {
        resolution = "高清";
    } else if (r === 1080) {
        resolution = "超清";
    }
    definition = index
    videoUrl.push([url, "video/mp4", resolution]);
    return videoUrl;
};

//获取当前视频url
let getCurrentVideoUrl = async (vid: string, r: number): Promise<VideoUrl> => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await getVideoUrl(vid, r);
            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
};

export default initVideoUrlOption