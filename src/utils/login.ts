import { useUserInformation } from "@/store/user";
import { ElMessage } from 'element-plus';


let user = useUserInformation()

export const loginCallback = (callback : Function) => {
    if(user.user_profile.isLogin) {
        callback()
    } else {
        ElMessage.warning('请先登录,在完成后续操作')
        return;
    }
}