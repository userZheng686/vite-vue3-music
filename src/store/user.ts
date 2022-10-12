import { defineStore } from "pinia";
import { cookie, likes } from '@/localStorage/init'
import { getLikeMusic } from '@/api/api_like'
import { userStatus, userDetail } from '@/api/api_user'
import { getUserSongMenu } from '@/api/api_playList'
import { Names } from 'i/store/enum.d'
import { playlist } from 'i/api/api_playList.d'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
let user = ref<any>({})
let user_profile = ref<any>({
    vipType: 0,
    nickname: '未登录',
    isLogin: Object.keys(cookie.value).length ? true : false
})
let songMenu = ref<playlist[]>([])

/**获取登录状态 */
let getUserStatus = async () => {
    try {
        let { data: { profile, account } } = await userStatus()
        if (profile) {
            let res = await userDetail(profile.userId)
            user.value = res;
            user_profile.value = res.profile
            user_profile.value.isLogin = true
            getLikeMusicList()
            getUserSongMenuList()
        }
    } catch (e: any) {
        // ElMessage.error(e?.message || '获取登录状态失败 请检查你的网络是否有问题')
    }
}


/**加载喜欢的音乐 */
let getLikeMusicList = async () => {
    try {
        let res = await getLikeMusic(user_profile.value.userId)
        likes.value = res.ids
    } catch (e: any) {
        ElMessage.error(e?.message || '请求喜欢的音乐列表失败 请检查你的网络是否有问题')
    }
}

/**加载用户的歌单*/
let getUserSongMenuList = async () => {
    try {
        let res = await getUserSongMenu(user_profile.value.userId)
        songMenu.value = res.playlist
    } catch (e: any) {
    }
}


getUserStatus()


export const useUserInformation = defineStore(Names.USER, {
    state: () => {
        return {
            user,
            user_profile,
            likes,
            songMenu
        }
    },
    getters: {

    },
    actions: {
        //设置用户信息
        setUserProfile(val: any) {
            this.user_profile = val
        },
        //更新用户喜欢的歌曲id
        updateUserLikeIds(id: number) {
            let index = this.likes.indexOf(id);
            if (index !== -1) {
                this.likes.splice(index, 1);
            } else {
                this.likes.push(id);
            }
        },
        //对用户歌单进行添加歌曲等任意操作后，需要及时更新列表 这里不能自己去做更新 不然会有奇怪的bug出现
        updateSoneMenu() {
            getUserSongMenuList()
        },
        //更新用户信息
        refreshUserInfo(){
            getUserStatus()
        }
    }
})