

<template>
    <CustomElementTable
        :list="weekList"
        :isShowLabel="false"
        :index="true"
        :operate="true"
        :name="true"
        :total="weekList.length"
        :pageSize="weekList.length"
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

let weekList = inject('weekList') as Ref<SongDetailSongsItem[]>
let search = ref<string>("");

provide("search", search)

let loading = computed(() => {
    if(weekList.value.length) {
        return false
    }else {
        return true
    }
})
</script>

<style scoped>

</style>