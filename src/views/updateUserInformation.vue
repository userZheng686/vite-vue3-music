<template>
    <div class="update--detaile">
        <div class="title">编辑个人信息</div>
        <div class="edit">
            <div class="edit--left">
                <div class="edit--item">
                    <span class="item__left">昵称</span>
                    <el-input v-model="detail.nickname" style="width: 422px" placeholder="请输入歌单名" />
                </div>
                <div class="edit--item">
                    <span class="item__left">介绍</span>
                    <el-input style="width: 422px" v-model="detail.signature" :rows="2" type="textarea" :maxlength="300"
                        placeholder="请输入介绍" />
                </div>
                <div class="edit--item">
                    <span class="item__left">性别</span>
                    <el-radio-group v-model="detail.gender" class="ml-4">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </div>
                <div class="edit--item">
                    <span class="item__left">生日</span>
                    <el-date-picker format="YYYY/MM/DD" value-format="x" v-model="detail.birthday" type="date" placeholder="Pick a day"  />
                </div>
                <div class="edit--item">
                    <span class="item__left">地区</span>
                    <el-cascader  :options='options' v-model='detail.area' @change='addressChange'></el-cascader>
                </div>
                <div class="edit--item">
                    <span class="item__left"></span>
                    <el-button type="danger" @click="save">保存</el-button>
                    <el-button @click="
                      router.push({
                        path: '/songMenuDetail',
                        query: {
                          id: route.query.id,
                        },
                      })
                    ">取消</el-button>
                </div>
            </div>
            <div class="edit--right">
                <DefaultImage :lazy="false" :picUrl="detail.avatarUrl" :param="240" :y="240" loadingHeight="120px"
                    loadingWidth="120px" style="
            height: 240px;
            width: 240px;
            overflow: hidden;
            border: 1px solid #eee;
            border-radius: 8px;
          " />
                <el-button style="margin-top: 20px" @click="updateCover">修改头像</el-button>
                <input alt="" accept="image/*" id="file" style="display: none" type="file" @change="choseImg" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {updateUserInfo} from '@/api/api_user'
import { useUserInformation } from '@/store/user'
import { useRoute, useRouter } from "vue-router";
import { provinceAndCityData , CodeToText } from 'element-china-area-data'
import { uploadAvatar } from '@/utils/request';
import { copyVal } from '@/utils/copy';

let route = useRoute();
let router = useRouter();
let user = useUserInformation()
let textarea = ref<string>("");
let elMessage: any = inject("message") as any;

let options = provinceAndCityData 

let detail = reactive<{
    nickname: string,
    gender: number,
    signature: string,
    birthday: number,
    area : string[],
    city : number,
    province : number,
    avatarUrl: string
}>({
    nickname: '',
    gender: 1,
    signature: '',
    birthday: 0,
    city: 110000,
    province : 110100,
    area : ['110000', '110100'],
    avatarUrl: "",
})



//更新歌单封面
let updateCover = () => {
    let file: null | HTMLInputElement = document.querySelector("#file");
    if (file) {
        file.click();
    }
};

//选择图片
let choseImg = async function (e: Event) {
    if (e.target instanceof HTMLInputElement) {
        if (e.target.files?.length) {
            let file = e.target.files[0];
            console.log("file", file);
            e.target.value = "";
            try {
                let res = await uploadAvatar(file);
                detail.avatarUrl = res.data.url;
                elMessage.success("更新成功");
            } catch (e: any) {
                elMessage.error(e.message || "更新失败");
            }
        }
    }
};

//更改地区
function addressChange (arr : number[]) {
    detail.province = arr[0]
    detail.city = arr[1]
}


//保存更改
let save =  async () => {
    try {
        let res = await updateUserInfo(detail)
        elMessage.success("保存成功")
        console.log('res',res)
    } catch (e : any) {
        elMessage.error(e?.message || "保存失败")
    }
}

watchEffect(() => {
    if (user?.user_profile) {
        copyVal(user.user_profile,detail)
        detail.area = [`${user?.user_profile.province}`,`${user?.user_profile.city}`]
    }
})


onActivated(() => {

});
</script>

<style scoped lang="scss">
.update--detaile {
    margin-left: 30px;
    margin-top: 20px;
    width: 50%;
}

.title {
    font-size: 24px;
    font-weight: bold;
}

.edit {
    display: flex;
}

.edit--left {}

.edit--right {
    width: 30%;
    padding-top: 20px;
    margin-left: 30px;
}

.edit--item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    line-height: 18px;
}

.item__left {
    width: 60px;
}

:deep(.el-textarea__inner) {
    height: 150px;
    resize: none;
}

.mr-1 {
    margin-right: 5px;
}
</style>
