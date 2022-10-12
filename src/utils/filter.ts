//显示数字(xxx万这种)
let filter = function (count: number) {
    if (typeof count === 'undefined') return 0
    if (count < 10000) return count
    else return Math.floor(count / 10000) + '万'
}

//视频总时间（预览）
let playTime = function (time: number) {
    if (typeof time === 'undefined') return 0
    time = parseInt(String(time / 1000))
    let minutes: string | number = parseInt(String(time / 60)); // 获取时长分钟
    let seconds: string | number = parseInt(String(time % 60)); // 获取时长秒数
    seconds = seconds < 10 ? '0' + seconds : seconds// 秒
    minutes = minutes < 10 ? '0' + minutes : minutes // 分
    return minutes + ':' + seconds
}

//视频发布时间
let videoTime = function (time: number) {
    let { y, month, d } = formDate(time)
    return `${y}-${month}-${d}`
}

//评论发布时间
let commentTime = function (time: number) {
    let { y, month, d, h, minute } = formDate(time)
    return `${y}年${month}月${d}日 ${h}:${minute} `
}

//专辑发布时间
let albumTime = function (time: number) {
    let { y, month, d, } = formDate(time)
    return `${y}年${month}月${d}日`
}

//音频播放时间计算
let transTime = (time: number, isHaveMillisecond?: boolean) => {
    let mill
    if (isHaveMillisecond) {
        mill = String(time).split('.')[1]?.substring(0, 3)
    }
    let duration = parseInt(String(time));
    let minute: string | number = parseInt(String(duration / 60));
    let sec = (duration % 60) + "";
    let isM0 = ":";
    if (minute === 0) {
        minute = "00";
    } else if (minute < 10) {
        minute = "0" + minute;
    }
    if (sec.length === 1) {
        sec = "0" + sec;
    }

    if (mill) {
        return minute + isM0 + sec + '.' + mill;
    } else {
        return minute + isM0 + sec;
    }
};

//将歌词时间转换为对应的毫秒时间（从0开始）（number）
let lyricTime = function (time: string) {
    let timeArr = time.split(/:|\./)
    let minuted = Number(timeArr[0]) * 60 * 1000;
    let seconds = Number(timeArr[1]) * 1000;
    let milliseconds = Number(timeArr[2])
    return minuted + seconds + milliseconds
}



//歌曲播放时间 目前好像就两种 一个是最近播放的 距离现在有多久时间 另一个是歌曲总时长
let recentlySongTime = function (time: number) {
    let nowTime = new Date().getTime()
    let total = nowTime - time
    let str = ''
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30
    const year = month * 12
    //分钟 小时 天数 月数 年
    //如果超过了60秒 就显示多少分钟
    //如果超过了60分钟 就显示多少个小时
    //如果超过了24小时 就显示多少天数
    //如果超过30或者31天 就显示多少个月
    //如果超过了12月 就显示一年
    if (total < second) {
        str = '刚刚'
    } else if (total < minute) {
        let num = total / second
        str = String(parseInt(String((total / second)))) + '秒前'
    } else if (total < hour) {
        str = String(parseInt(String((total / minute)))) + '分前'
    } else if (total < day) {
        str = String(parseInt(String((total / hour)))) + '小时前'
    } else if (total < month) {
        str = String(parseInt(String((total / day)))) + '天前'
    } else if (total < year) {
        str = String(parseInt(String((total / month)))) + '个月前'
    } else {
        str = String(parseInt(String((total / year)))) + '年前'
    }
    return str
}


//格式化日期
function formDate(date: number) {
    let y = new Date(date).getFullYear() + ''
    let month = (new Date(date).getMonth() + 1) >= 10 ? (new Date(date).getMonth() + 1) + '' : '0' + (new Date(date).getMonth() + 1)
    let d = new Date(date).getDate() >= 10 ? new Date(date).getDate() + '' : '0' + new Date(date).getDate()
    let h = new Date(date).getHours() >= 10 ? new Date(date).getHours() + '' : '0' + new Date(date).getHours()
    let minute = new Date(date).getMinutes() >= 10 ? new Date(date).getMinutes() + '' : '0' + new Date(date).getMinutes()
    let s = new Date(date).getSeconds() >= 10 ? new Date(date).getSeconds() + '' : '0' + new Date(date).getSeconds()
    return {
        y, month, d, h, minute, s
    }
}

//表情包
let emotionLeft = [
    {
        show: "😀",
        meaning: "大笑"
    },
    {
        show: "🙂",
        meaning: "微笑",
    },
    {
        show: "😊",
        meaning: "可爱",
    },
    {
        show: "😄",
        meaning: "憨笑",
    },
    {
        show: "😍",
        meaning: "色",
    },
    {
        show: "😱",
        meaning: "惊恐",
    },
    {
        show: "😭",
        meaning: "流泪",
    },
    {
        show: "😙",
        meaning: "亲",
    },
    {
        show: "😳",
        meaning: "呆",
    },
    {
        show: "😔",
        meaning: "哀伤",
    },
    {
        show: "😁",
        meaning: "呲牙",
    },
    {
        show: "😛",
        meaning: "吐舌",
    },
    {
        show: "😕",
        meaning: "撇嘴",
    },
    {
        show: "😡",
        meaning: "怒",
    },
    {
        show: "😏",
        meaning: "奸笑",
    },
    {
        show: "😓",
        meaning: "汗",
    },
    {
        show: "😖",
        meaning: "痛苦",
    },
    {
        show: "😰",
        meaning: "惶恐",
    },
    {
        show: "😨",
        meaning: "生病",
    },
    {
        show: "😷",
        meaning: "口罩",
    },
    {
        show: "😭",
        meaning: "大哭",
    },
    {
        show: "😵",
        meaning: "晕",
    },
    {
        show: "😡",
        meaning: "发怒",
    },
    {
        show: "😊",
        meaning: "开心",
    },
    {
        show: "😜",
        meaning: "鬼脸",
    },
    {
        show: "😞",
        meaning: "皱眉",
    },
    {
        show: "🤧",
        meaning: "流感",
    },
    {
        show: "❤",
        meaning: "爱心",
    },
    {
        show: "💔",
        meaning: "心碎",
    },
    {
        show: "❤",
        meaning: "钟情",
    },
];
let emotionRight = [
    {
        show: "⭐",
        meaning: "星星",
    },
    {
        show: "💢",
        meaning: "怒",
    },
    {
        show: "💩",
        meaning: "便便",
    },
    {
        show: "👍",
        meaning: "强",
    },
    {
        show: "👎",
        meaning: "弱",
    },
    {
        show: "🙏",
        meaning: "拜",
    },
    {
        show: "👫",
        meaning: "牵手",
    },
    {
        show: "💃",
        meaning: "跳舞",
    },
    {
        show: "🙅‍",
        meaning: "禁止",
    },
    {
        show: "💁‍♂️",
        meaning: "这边",
    },
    {
        show: "💑",
        meaning: "爱意",
    },
    {
        show: "💞",
        meaning: "示爱",
    },
    {
        show: "💋",
        meaning: "嘴唇",
    },
    {
        show: "🐶",
        meaning: "狗",
    },
    {
        show: "🐱",
        meaning: "猫",
    },
    {
        show: "🐖",
        meaning: "猪",
    },
    {
        show: "🐇",
        meaning: "兔子",
    },
    {
        show: "🐥",
        meaning: "小鸡",
    },
    {
        show: "🐓",
        meaning: "公鸡",
    },
    {
        show: "👻",
        meaning: "幽灵",
    },
    {
        show: "🎄",
        meaning: "圣诞",
    },
    {
        show: "👽",
        meaning: "外星",
    },
    {
        show: "💎",
        meaning: "钻石",
    },
    {
        show: "🎁",
        meaning: "礼物",
    },
    {
        show: "👦🏻",
        meaning: "男孩",
    },
    {
        show: "👧🏻",
        meaning: "女孩",
    },
    {
        show: "🎂",
        meaning: "蛋糕",
    },
    {
        show: "🔞",
        meaning: "18",
    },
    {
        show: "⭕",
        meaning: "圈",
    },
    {
        show: "❌",
        meaning: "叉",
    },
];

//表情整合
let emotionAll = emotionLeft.concat(emotionRight)
emotionAll.flat(Infinity)
//map
let emotionMap = new Map()
emotionAll.forEach(item => {
    emotionMap.set(`[${item.meaning}]`, item.show)
})

//格式化评论内容 将评论里面的[大笑]这种表达换成emoji
let normalizeCommentContent = (content: string): Array<{
    content: string,
    isNeedColor: boolean,
    mark: string
    url : string
}> => {
    if(!content) return [];
    //判断是否有网页链接 如果有就替换
    let href = content.match(/http.*/g)
    let linkArray : Array<{
        content: string,
        isNeedColor: boolean,
        mark: string
        url : string
    }> = []
    if(href) {
        href.forEach(item => {
            linkArray.push({
                content : '网页链接',
                isNeedColor : true,
                mark : 'href',
                url : item
            })
        })
        content = content.replaceAll(/http.*/g,'')
    }

    //这里用map查找 减少运行时消耗
    content = content.replace(/\[[\u4E00-\u9FA5]{1,2}]/g, function (s) {
        let match = emotionMap.get(s)
        if (match) return match
        else return s
    })

    //匹配@ #.#
    let split = content.split('')
    let atClose = 0, topicClose = 0
    let atObj = {
        content: '',
        isNeedColor: true,
        mark: 'at',
        url : ''
    }, topicObj = {
        content: '',
        isNeedColor: true,
        mark: 'hash',
        url : ''
    }, otherObj = {
        content: '',
        isNeedColor: false,
        mark: '',
        url : ''
    }
    let contents: Array<{
        content: string,
        isNeedColor: boolean,
        mark: string,
        url : string
    }> = []
    split.forEach(item => {
        if (item === '@') {
            if (otherObj.content) {
                let copyVal = JSON.parse(JSON.stringify(otherObj))
                contents.push(copyVal)
                otherObj.content = ''
            }
            atObj.content += '@'
            atClose++
        } else if (item === '#') {
            if (otherObj.content) {
                let copyVal = JSON.parse(JSON.stringify(otherObj))
                contents.push(copyVal)
                otherObj.content = ''
            }
            topicClose++
            if (topicClose === 2) {
                topicObj.content += '#'
                let copyVal = JSON.parse(JSON.stringify(topicObj))
                contents.push(copyVal)
                topicObj.content = ''
                topicClose = 0
            } else {
                topicObj.content += '#'
            }
        } else if (item === ' ' && atClose === 1) {
            atObj.content += ' '
            let copyVal = JSON.parse(JSON.stringify(atObj))
            contents.push(copyVal)
            atObj.content = ''
            atClose = 0
        } else {
            if (atClose) {
                atObj.content += item
            } else if (topicClose) {
                topicObj.content += item
            } else {
                otherObj.content += item
            }
        }
    })
    if (otherObj.content) {
        contents.push(otherObj)
    }
    if(linkArray.length){
        linkArray.forEach(item => {
            contents.push(item)
        })
    }
    if(atObj.content){
        let copyVal = JSON.parse(JSON.stringify(atObj))
        contents.push(copyVal)
        atObj.content = ''
    }

    //匹配链接
    // content = content.replace(/http.*/g, function (s: string) {
    //     let match = `<a href=${s} target='_blank' data-href=${s}  class='blue href'><i class='iconfont icon-fuzhilianjie'></i>网页链接</a>`
    //     return match
    // })

    return contents
}




//容量计算
//根据指定的单位来转换容量计算
let diskSize = function (size: number, unit: string) {
    let res = ''
    let B = 8
    let KB = 1024 * B
    let MB = 1024 * KB
    let GB = 1024 * MB
    let TB = 1024 * GB

    switch (unit) {
        case 'K': { res = String(size / KB) }; break;
        case 'M': { res = String(size / MB) }; break;
        case 'G': { res = String(size / GB) }; break;
        case 'T': { res = String(size / TB) }; break;
    }

    return res
}

export {
    filter,
    playTime,
    formDate,
    lyricTime,
    videoTime,
    transTime,
    commentTime,
    albumTime,
    emotionLeft,
    emotionRight,
    normalizeCommentContent,
    recentlySongTime,
    diskSize
}