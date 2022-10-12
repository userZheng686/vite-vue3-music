import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'
import { sendType } from 'i/api/api_message.d'

//分享主窗口
//是否显示
let mainShareWindowShow: boolean = false

//分享子窗口
//是否显示
let childSpaceWindowShow: boolean = false
//分享的内容
let childSpaceWindowContent: string = ""
//分享的图片
let childSpaceWindowImg: string = ""
//分享的类型
let childSpaceWindowType: string = ""
//分享的来源
let childSpaceWindowSource: string = ""
//分享的id
let childSpaceWindowId: number | string
//分享的数量
let childSpaceWindowCount: number = 0
//分享后的回调事件
let childSpaceWindowCallback: Function = () => { }

//动态子窗口
//是否显示
let childEventWindowShow: boolean = false
//分享的id
let childEventWindowId : number 
//分享的用户id
let childEventWindowUserId : number 

//评论输入
let content: string = ""
//at
let at: boolean = false
//emotion
let emotion: boolean = false
//topic
let topic: boolean = false

//输入的内容
let shareContent: string = ""
//at
let shareAt: boolean = false
//emotion
let shareEmotion: boolean = false
//topic
let shareTopic: boolean = false

//私信子窗口
//是否显示
let childPrivateLetterShow: boolean = false
let childPrivateLetterShareShow: boolean = false

//私信选中的用户（id 用户名）
let checkUserIds: number[] = []
let checkUserNames: string[] = []

//emotion
let privateLetterEmotion: boolean = false
//分享的类型(song playlist )
let privateLetterType: sendType = 'song'

//复制链接
let source: string = ""

//分享动态子窗口
let childShareEventWindowShow : boolean = false
//分享动态子窗口回调事件
let childShareEventWindowCallback : Function = () => {}


//qq分享
let qqShareLink : string = ''
//qq空间分享
let qqSpaceShareLink : string = ''

//微信分享子窗口
let childWXShow : boolean = false

//分享列表展示 一共是云音乐动态 私信分享 qq好友分享 qq空间分享 微信好友分享 复制链接
let menuList = {
    space : true,
    privateLetter : true,
    qq : true,
    qqSpace : true,
    WX : true,
    link : true,
}

export const useSharePopupStore = defineStore(Names.SHAREPOPUP, {
    state: () => {
        return {
            mainShareWindowShow,
            childSpaceWindowShow,
            childSpaceWindowContent,
            childSpaceWindowImg,
            childSpaceWindowType,
            childSpaceWindowSource,
            childSpaceWindowId,
            childSpaceWindowCount,
            childSpaceWindowCallback,
            childEventWindowShow,
            childEventWindowId,
            childEventWindowUserId,
            content,
            at,
            emotion,
            topic,
            shareContent,
            shareAt,
            shareEmotion,
            shareTopic,
            childPrivateLetterShow,
            childPrivateLetterShareShow,
            privateLetterType,
            source,
            checkUserIds,
            checkUserNames,
            privateLetterEmotion,
            childShareEventWindowShow,
            childShareEventWindowCallback,
            qqShareLink,
            qqSpaceShareLink,
            childWXShow,
            menuList
        }
    },
    getters: {},
    actions: {
        //打开动态分享子窗口
        openChildSpace() {
            this.mainShareWindowShow = false
            this.childSpaceWindowShow = true
        },
        //打开私信子窗口
        openChildPrivateLetter() {
            this.mainShareWindowShow = false
            this.childSpaceWindowShow = false
            this.childPrivateLetterShow = true
        },
        //打开私信分享子窗口
        openChildPrivateLetterShare() {
            this.mainShareWindowShow = false
            this.childSpaceWindowShow = false
            this.childPrivateLetterShow = false
            this.childPrivateLetterShareShow = true
        },
        //打开分享动态子窗口
        openChildShareEvent(){
            this.childShareEventWindowShow = true
        },
        //打开微信分享子窗口
        openChildWX(){
            this.mainShareWindowShow = false
            this.childWXShow = true
        },
        //关闭分享子窗口
        closeChildSpace() {
            this.mainShareWindowShow = false
            this.childSpaceWindowShow = false
            this.childSpaceWindowContent = ''
            this.childSpaceWindowImg = ''
            this.childSpaceWindowType = ''
            this.childSpaceWindowSource = ''
            this.childSpaceWindowId = 0
            this.childSpaceWindowCount = 0
            this.childSpaceWindowCallback = () => { }
            this.shareContent = ''
            this.shareAt = false
            this.shareEmotion = false
            this.shareTopic = false
            this.source = ''
        },
        //关闭动态子窗口
        closeChildEvent(){
            this.childEventWindowShow = false
            this.childEventWindowId = 0
            this.childEventWindowUserId = 0
            this.shareContent = ''
        },
        //关闭私信分享子窗口
        closeChildPrivateLetterShare() {
            this.childPrivateLetterShareShow = false
            this.closeChildSpace()
            this.checkUserIds = []
            this.checkUserNames = []
        },
        //关闭分享动态子窗口
        closeChildShareEvent(){
            this.childShareEventWindowShow = false
            this.content = ''
            this.childShareEventWindowCallback = () => {}
        },
        //关闭微信分享子窗口
        closeChildWX(){
            this.childWXShow = true
        },
        //设置菜单列表显示
        setMenuList(item : {space : boolean,privateLetter : boolean,qq : boolean,qqSpace : boolean,WX : boolean,link : boolean}){
            Object.assign(this.menuList,item)
        }
    }
})