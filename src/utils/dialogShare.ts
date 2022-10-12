//分享弹窗
import { useSharePopupStore } from "@/store/sharePopup";
//用户
import { useUserInformation } from "@/store/user"
import { ElMessage } from 'element-plus';

//分享
let sharePopup = useSharePopupStore();
//用户
let user = useUserInformation()


//分享评论到动态
const useCommentShare = (id: number, type: string, title: string) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : false,qqSpace : false,WX : false,link : false})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = type;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = '';
    //标记 分享类型为评论
    sharePopup.childSpaceWindowSource = "noresource";
    //主窗口打开
    sharePopup.mainShareWindowShow = true
}

//分享歌曲到动态
const useSongShare = (id: number, currentSongImg: string, title: string) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `单曲`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为歌曲
    sharePopup.childSpaceWindowSource = "song";
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/song?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'song'
    useQQShare(`http://music.163.com/song?id=${id}`, `分享单曲：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/song?id=${id}`, `分享单曲：${title}`, currentSongImg)
};



//分享MV到动态
const useMvShare = (id: number, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `视频`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为mv
    sharePopup.childSpaceWindowSource = "mv";
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //链接复制
    sharePopup.source = `http://music.163.com/mv?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'mv'
    useQQShare(`http://music.163.com/mv?id=${id}`, `分享MV：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/mv?id=${id}`, `分享MV：${title}`, currentSongImg)
};

//分享视频到动态
const useVideoShare = (id: string, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `视频`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为视频
    sharePopup.childSpaceWindowSource = "cloudvideo";
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //链接复制
    sharePopup.source = `http://music.163.com/?video=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'video'
    useQQShare(`http://music.163.com/video?id=${id}`, `分享视频：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/video?id=${id}`, `分享视频：${title}`, currentSongImg)
};


//分享歌单到动态
const useLISTShare = (id: number, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `歌单`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为歌单
    sharePopup.childSpaceWindowSource = "playlist";
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/playlist?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'playlist'
    useQQShare(`http://music.163.com/playlist?id=${id}`, `分享歌单：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/playlist?id=${id}`, `分享歌单：${title}`, currentSongImg)
};

//分享专辑到动态
const useAlbumShare = (id: number, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `专辑`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为专辑
    sharePopup.childSpaceWindowSource = "album";
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/album?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'album'
    useQQShare(`http://music.163.com/album?id=${id}`, `分享专辑：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/album?id=${id}`, `分享专辑：${title}`, currentSongImg)
};


//分享播客到动态
const useRadioShare = (id: number, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `播客`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为播客
    sharePopup.childSpaceWindowSource = "djradio";
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/radio?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'djradio'
    useQQShare(`http://music.163.com/radio?id=${id}`, `分享播客：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/radio?id=${id}`, `分享播客：${title}`, currentSongImg)
};

//分享播客节目到动态
const useRadioProgramShare = (id: number, currentSongImg: string, title: string, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : true,qq : true,qqSpace : true,WX : true,link : true})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `声音`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为声音
    sharePopup.childSpaceWindowSource = "djprogram";
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/dj?id=${id}&userid=${user.user_profile.userId}`
    //私信分享的类型
    sharePopup.privateLetterType = 'djprogram'
    useQQShare(`http://music.163.com/radio?id=${id}`, `分享声音：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/radio?id=${id}`, `分享声音：${title}`, currentSongImg)
};

//分享话题
const useTopicShare = (id : number, currentSongImg: string, title: string) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : false,privateLetter : false,qq : true,qqSpace : true,WX : true,link : true})
    //主窗口打开
    sharePopup.mainShareWindowShow = true
    //链接复制
    sharePopup.source = `http://music.163.com/activity?id=${id}&userid=${user.user_profile.userId}`
    useQQShare(`http://music.163.com/activity?id=${id}`, `分享话题：${title}`, currentSongImg)
    useQQSpaceShare(`http://music.163.com/activity?id=${id}`, `分享话题：${title}`, currentSongImg)
}

//分享动态
const useEventShare = (id: number, userid: number, callback: Function) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //分享的类型Id
    sharePopup.childEventWindowId = id
    //分享的用户id
    sharePopup.childEventWindowUserId = userid
    //回调事件
    sharePopup.childSpaceWindowCallback = callback;
    //打开弹窗
    sharePopup.childEventWindowShow = true
};

//qq分享
const useQQShare = (url: string, title: string, pics: string, summary?: string) => {
    let link = ''
    if (user?.user_profile?.userId) {
        url += `&userid=${user.user_profile.userId}&from=qq`
    } else {
        url += `&from=qq`
    }
    if (summary) {
        link = `https://connect.qq.com/widget/shareqq/index.html?site=网易云音乐&url=${encodeURIComponent(url)}&title=${title}&pics=${pics}&summary=${summary}`
    } else {
        link = `https://connect.qq.com/widget/shareqq/index.html?site=网易云音乐&url=${encodeURIComponent(url)}&title=${title}&pics=${pics}`
    }
    sharePopup.qqShareLink = link
}

//qq空间分享
const useQQSpaceShare = (url: string, title: string, pics: string, summary?: string) => {
    let link = ''
    if (user?.user_profile?.userId) {
        url += `&userid=${user.user_profile.userId}&from=qzone`
    } else {
        url += `&from=qzone`
    }
    if (summary) {
        link = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?site=网易云音乐&url=${encodeURIComponent(url)}&title=${title}&pics=${pics}&summary=${summary}`
    } else {
        link = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?site=网易云音乐&url=${encodeURIComponent(url)}&title=${title}&pics=${pics}`
    }
    sharePopup.qqSpaceShareLink = link
}

/**
 * 分享专栏
 */
const useColumnShare = (id : number,title : string,currentSongImg : string) => {
    if(!user.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        return;
    }
    //设置菜单列表
    sharePopup.setMenuList({space : true,privateLetter : false,qq : false,qqSpace : false,WX : false,link : false})
    //分享的类型Id
    sharePopup.childSpaceWindowId = id
    //分享的类型
    sharePopup.childSpaceWindowType = `专栏`;
    //分享的内容
    sharePopup.childSpaceWindowContent = title;
    //分享的封面
    sharePopup.childSpaceWindowImg = currentSongImg;
    //标记 分享类型为专栏
    sharePopup.childSpaceWindowSource = "topic";
    //主窗口打开
    sharePopup.mainShareWindowShow = true
}

export {
    useCommentShare,
    useTopicShare,
    useColumnShare,
    useSongShare,
    useMvShare,
    useVideoShare,
    useAlbumShare,
    useLISTShare,
    useRadioShare,
    useEventShare,
    useRadioProgramShare,
    useQQShare,
    useQQSpaceShare
}