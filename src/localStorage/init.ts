import { RadioItem } from "i/localStorage/interface";
import { SongDetailSongsItem } from "i/api/api_song";
import { useStorage } from "@vueuse/core";
import { Ref } from "vue";

export const recommendMenuList : Ref<Array<{
    order : number,
    component : string,
    name : string
}>> = useStorage('recommendMenuList',[{
    order: 1,
    component : 'RecommendPlaylist',
    name : '推荐歌单'
},{
    order: 2,
    component : 'RecommendPrivate',
    name : '独家放送'
},{
    order: 3,
    component : 'RecommendMusic',
    name : '最新音乐'
},{
    order: 4,
    component : 'RecommendMv',
    name : '推荐MV'
},{
    order: 5,
    component : 'RecommendRadio',
    name : '播客'
},])

export const mode : Ref<string> = useStorage('vueuse-color-scheme','')

//歌词
export const lrcWords: Ref<Array<{
    currentTime: number,
    endTime: number,
    show: boolean,
    startTime: number,
    text: string
}>> = useStorage("lrcWords", [])
export const translationLrcWords: Ref<Array<{
    show: boolean,
    text: string
}>> = useStorage("translationLrcWords", [])

//逐字渲染的歌词
export const yrcWords: Ref<string[]> = useStorage("yrcWords", [])

//play方法 用于操控列表
export const isEnterSongDetail = useStorage("isEnterSongDetail", false)
export const isPrevSong = useStorage("isPrevSong", false)
export const isPlayMusic = useStorage("isPlayMusic", false)
export const isNextSong = useStorage("isNextSong", false)
export const isForward = useStorage("isForward", false)
export const isRewind = useStorage("isRewind", false)
export const isPlay = useStorage("isPlay", false)
export const isOperateRadio = useStorage("isOperateRadio", false)
export const isOperateMusic = useStorage("isOperateMusic", false)
export const audioTime = useStorage("audioTime", 0)

//分享的事件
export const isShare = useStorage("isShare", false)
export const shareParam = useStorage("shareParam", {
    id: 0,
    type: 'song',
    title: '',
    currentSongImg: '',
    ar : []
})

//下载的事件
export const isDownload = useStorage("isDownload", false)
export const downloadParam: Ref<string> = useStorage("downloadParam", '')

//评论
export const isOpenComment = useStorage("isOpenComment", false)
export const commentType = useStorage("commentType", 'song')
export const commentId = useStorage("commentId", 0)

//当前播放列表
export const list: Ref<SongDetailSongsItem[]> = useStorage("list", []);
export const isChangeCurrentListIndex = useStorage("isChangeCurrentListIndex", false);
export const currentListIndex: Ref<number> = useStorage("currentListIndex", 0);

//专辑
export const isOpenAlbum = useStorage("isOpenAlbum", false)
export const albumId: Ref<number> = useStorage("albumId", 0);

//从播放列表中移除
export const isRemoveItem = useStorage("isRemoveItem", false)
export const removeItemId: Ref<number | string> = useStorage("removeItemId", 0);

//radio
export const radio: Ref<{
    [propname: string]: RadioItem;
}> = useStorage("radio", {});

//登录相关
export const cookie = useStorage('cookie', '')

//音量
export const volumn = useStorage("volumn", 50);

//喜欢的歌曲
export const likes: Ref<number[]> = useStorage("likes", [])

//是否是轻音乐
export const isLightMusic = useStorage("isLightMusic", false);

//本地播放记录
export const historyList : Ref<SongDetailSongsItem[]> = useStorage("historyList",[]);

//歌曲播放规则
//顺序播放 列表循环 单曲循环 随机播放 心动模式
export const rule : Ref<string> = useStorage("rule",'0'); 
rule.value = '0'


//更新版本
export const version : Ref<string> = useStorage("version","1.0.0")


//版本更新提示
export const releaseNotes : Ref<string> = useStorage("releaseNotes","")

//当前应用模式 0 完整模式 1 mini模式 2最小化
export const changeMode : Ref<number> = useStorage("changeMode",0);
changeMode.value = 0


//搜索记录
export const searchHistoryList : Ref<Array<{
    keyword : string;
    isOver : boolean;
}>> = useStorage("searchHistoryList", [])

//锁歌词
export const lockLyric : Ref<boolean> = useStorage("lockLyric", false);
lockLyric.value = false


//打开桌面歌词
export const openLyric : Ref<boolean> = useStorage("openLyric", false);
openLyric.value = false

