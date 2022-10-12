

<template>
    <CustomElementTable
        :list="allList"
        :isShowLabel="false"
        :index="true"
        :operate="true"
        :name="true"
        :total="allList.length"
        :pageSize="allList.length"
        :playCount="true"
        :contextMenu="contextMenuSong"
    >
        <template #default>
           <LoadingComponent v-if="loading"/>
        </template>
    </CustomElementTable>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { SongDetailSongsItem } from "i/api/api_song";
import {contextMenuSong} from "@/contextMenu/song/normal";

let allList = inject('allList') as Ref<SongDetailSongsItem[]>
let search = ref<string>("");

provide("search", search)

let loading = computed(() => {
    if(allList.value.length) {
        return false
    }else {
        return true
    }
})
</script>

<style scoped>

</style>