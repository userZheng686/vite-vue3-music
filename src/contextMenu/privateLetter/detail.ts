import { menusEvent } from "vue3-menus";
import { ElMessage } from 'element-plus';
import { PrivateMsgHistoryMsgsItem } from 'i/api/api_message.d';
import { Ref } from "vue";
import { deletePrivateMsgSingle } from "@/api/api_message";



export function contextMenuMessageDetail(event: MouseEvent, list : PrivateMsgHistoryMsgsItem[],item: PrivateMsgHistoryMsgsItem) {
    let menuList = [{
        label: "删除",
        icon: "<i class='iconfont icon-shanchu'></i>",
        tip: "",
        click : async () => {
            try {
                let id = item.id
                if(id) {
                    let res = await deletePrivateMsgSingle(id)
                    let index = list.findIndex(items => items.id === id)
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
