//全局通知

import { defineStore } from "pinia";
import { Names } from 'i/store/enum.d'
import { getPlCount } from "@/api/api_count";

//通知栏
//私信
let messageCount = ref<number>(0)
//评论
let commentCount = ref<number>(0)
//@我
let forwardCount = ref<number>(0)
//通知
let noticeCount = ref<number>(0)

//关注
let eventCount = ref<number>(0)
//我的播客
let newProgramCount = ref<number>(0)

let getPlCounts = async () => {
    try { 
        let { notice,forward,msg,comment,event,newProgramCount : newProgramCount1} = await getPlCount()
        messageCount.value = msg
        forwardCount.value = forward
        noticeCount.value = notice
        commentCount.value = comment
        eventCount.value = event
        newProgramCount.value = newProgramCount1
    } catch (e : any) {

    } 
}

getPlCounts()


export const useCount = defineStore(Names.COUNT, {
    state: () => {
        return {
            messageCount,
            commentCount,
            forwardCount,
            noticeCount,
            eventCount,
            newProgramCount
        }
    },
    getters: {

    },
    actions: {
        setMessageCount(val : number){
            this.messageCount = val
        },
        updateCount(){
            getPlCounts()
        }
    }
})