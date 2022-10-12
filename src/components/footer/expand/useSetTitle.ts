//接口声明
import { SongDetailSongsItem } from 'i/api/api_song.d'
//标题
import { useTitle } from "@vueuse/core";
//标题
let title = useTitle();

//设置标题
let setTitle = (item: SongDetailSongsItem | undefined) => {
    if (!item) {
        title.value = '网易云音乐'
    } else {
        let tns = item?.tns?.join("") || "";
        let author: string[] = [];
        item?.ar?.forEach((item) => {
            if (item.name) {
                author.push(item.name);
            }
        });
        if (author.join("").length) {
            title.value =
                item.name +
                " - " +
                author.join("");
        } else {
            title.value = item.name + tns;
        }
    }

};

export default setTitle