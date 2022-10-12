import { menusEvent } from "vue3-menus";
import { ElMessage } from 'element-plus';
import { PrivateMsgItem } from 'i/api/api_message.d';
import { Ref } from "vue";
import { deletePrivateMsg } from "@/api/api_message";


export function contextMenuMessageList(event: MouseEvent, list : PrivateMsgItem[],item: PrivateMsgItem) {
    let menuList = [{
        label: "删除",
        icon: "<i class='iconfont icon-shanchu'></i>",
        tip: "",
        click : async () => {
            try {
                let userId = item.fromUser.userId
                if(userId) {
                    let res = await deletePrivateMsg(userId)
                    let index = list.findIndex(items => items.fromUser.userId === userId)
                    if(index !== -1){
                        list.splice(index, 1)
                        ElMessage.success('删除成功')
                    }
                }
            } catch (e : any) {
                ElMessage.error('删除失败')
            }
        }
    }]
    menusEvent(event, menuList, '');
    event.preventDefault();
}
