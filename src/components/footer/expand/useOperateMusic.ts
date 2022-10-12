//收藏歌曲到歌单
import { addSongToSongMenu } from "@/api/api_playList";

//操作 取消还是喜欢音乐
export const operateMusic = async (songList: any, elMessage: any, userInfo: any) => {
    let id = Number(songList.list[songList.currentListIndex].id);
    let index = userInfo.likes.findIndex((item: number) => item === id);
    let like = true;
    if (index !== -1) like = false;
    try {
        let res = await addSongToSongMenu(
            `${like ? "add" : "del"}`,
            Number(userInfo.songMenu[0].id),
            Number(id)
        );
        elMessage.success(`${like ? "已成功添加到我喜欢的音乐" : "取消喜欢成功"}`);
        userInfo.updateUserLikeIds(id)
    } catch (e: any) {
        elMessage.error(e?.message || "操作失败");
    }
};