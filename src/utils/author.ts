
import { item } from 'i/utils/author.d'

/**处理数组 普通情况 显示author */
export const normalizeAuthor = (arr: Array<item>) => {
    arr.forEach((item: item) => {
        item.author = "";
        if (item?.artists.length) {
            item.artists.forEach((i) => {
                if (item.author === "") {
                    item.author = i.name;
                } else {
                    item.author += "/ " + i.name;
                }
            });
        } else if (item?.creator) {
            item.author = item.creator.nickname
        }
    })
}



