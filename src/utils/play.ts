//导入store里面的playList 主要是播放音乐 添加到列表里面 到时候播放器会自动取值
import { SongDetailSongsItem } from "i/api/api_song.d";
import { useSongStore } from "@/store/playList";
import { isPlay } from '@/localStorage/init'
import { ElMessage } from "element-plus";

//歌曲列表
let songList = useSongStore();

//播放方法（全部）
export function play(playList: SongDetailSongsItem[], id: number | string) {
    songList.list = []
    //需要购买的专辑
    let needBuyAlbum = playList.filter(item => item.fee === 4).map(item => item.name)
    if(needBuyAlbum.length) {
        ElMessage.warning(`${needBuyAlbum.join(',')}需要购买专辑才能收听`)
    }
    //过滤需要购买的专辑
    playList = playList.filter(item => item.fee !== 4)
    playList.forEach(item => {
        songList.setSongList(item)
    })
    //设置播放歌曲的index
    let currentIndex = songList.list.findIndex((item) => item.id === id);
    //如果点击的歌曲是需要购买专辑 那么就不做任何操作
    if (currentIndex !== -1) {
        if (songList.list[currentIndex]?.fee !== 4) {
            songList.setListIndex(currentIndex);
        }
    } else {
        songList.setListIndex(0);
    }

}


//播放（单曲）
export function playOne(item: SongDetailSongsItem) {
    songList.setSongList(item)
    let index = songList.list.findIndex(items => items.id === item.id);
    if (index !== -1) {
        songList.setListIndex(index)
    }
}
