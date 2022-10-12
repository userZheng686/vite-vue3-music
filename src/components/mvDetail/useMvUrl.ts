import emitter from "@/utils/eventBus";
import { getMvDetail, getMvUrl } from "@/api/api_mv";
import { MvDetailItemBrs, MvUrl } from 'i/api/api_mv.d'
//mv下载
import { useDownload } from '@/store/download'

//mv store
let download = useDownload()

//设置清晰度
let definition = 0



interface res {
    name: string;
    artists: Array<{
        id: number;
        name: string;
        img1v1Url: string;
        followed: boolean;
    }>;
    commentCount: number;
    cover: string;
    desc: string;
    duration: number;
    id: number;
    downloadStatus: boolean;
    playCount: number;
    publishTime: string;
    shareCount: number;
    subCount: number;
    subed: boolean;
    urlParam: string[];
}


//初始化整个url配置
/**
 * @param mvid mvid
 * @returns interface res
 */
let initMvUrlOption = (mvid: number): Promise<res> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: {
                artists,
                brs,
                commentCount,
                cover,
                desc,
                duration,
                id,
                name,
                playCount,
                publishTime,
                shareCount,
                subCount,

            }, subed } = await getMvDetail(mvid)

            //视频清晰度和url绑定 传到control组件上 这里另外写个函数处理
            let normAlizeVideoUrl: Array<string[]> = await settingMvGroupURL(brs, mvid)
            //这里将默认播放的清晰度和视频url链接一起拼接 传给control组件
            let normAlizeVideoOptions = {
                normAlizeVideoUrl,
                definition,
            };
            let downloadStatus = false

            if (window.downloadAPI) {
                download.completeDownloadMVItems.forEach(item => {
                    if (item.mvId === mvid) {
                        //进行url修改，添加自定义协议
                        if (!item.videoParam[0].includes('atom:///')) {
                            item.videoParam[0] = 'atom:///' + item.videoParam[0]
                        }

                        //修改原先配置的视频链接
                        normAlizeVideoOptions.normAlizeVideoUrl = [item.videoParam]
                        normAlizeVideoOptions.definition = 0
                        //已经下载过了 返回出去
                        downloadStatus = true
                    }
                })
            }

            emitter.emit("videoOptions", normAlizeVideoOptions);


            resolve({
                artists,
                commentCount,
                cover,
                desc,
                duration,
                id,
                name,
                downloadStatus,
                playCount,
                publishTime,
                shareCount,
                subCount,
                subed,
                urlParam: normAlizeVideoUrl[definition]
            })
        } catch (e: any) {
            let error = {
                message: e?.message || "请求MV详情失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })
}

//设置清晰度和对应的url
let settingMvGroupURL = (brs: MvDetailItemBrs[], mvid: number): Promise<string[][]> => {
    return new Promise(async (resolve, reject) => {
        let mvPromise: Promise<MvUrl>[] = []
        let mvUrl: string[][] = []
        brs.forEach((item) => {
            let promise = getCurrentMvUrl(mvid, item.br);
            mvPromise.push(promise);
        });

        Promise.allSettled(mvPromise)
            .then((res) => {
                res.forEach((item, index) => {
                    if (item.status === "fulfilled") {
                        let {
                            value: {
                                data: { url, r }
                            }
                        } = item;
                        normalizeVideoOption(mvUrl, url, r, index);
                    }
                });
                resolve(mvUrl);
            })
            .catch((err) => {
                reject(err);
            });

    })
}

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
let getCurrentMvUrl = async (mvid: number, r: number): Promise<MvUrl> => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await getMvUrl(mvid, r);
            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
};

export default initMvUrlOption