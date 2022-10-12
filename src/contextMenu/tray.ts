//tray

import { rule,changeMode } from "@/localStorage/init";
import { menusEvent } from "vue3-menus";

//播放顺序
export function contextMenuTrayPlayOrder(event: MouseEvent) {
    let list = [{
        label: '列表循环',
        icon: "<i class='iconfont icon-liebiaoxunhuan'></i>",
        tip: "",
        click: () => {
            rule.value = '1'
        },
    }, {
        label: '单曲循环',
        icon: "<i class='iconfont icon-hanhan-01-01'></i>",
        tip: "",
        click: () => {
            rule.value = '2'
        },
    }, {
        label: '随机播放',
        icon: "<i class='iconfont icon-22_suijibofang'></i>",
        tip: "",
        click: () => {
            rule.value = '3'
        },
    }, {
        label: '顺序播放',
        icon: "<i class='iconfont icon-shunxubofang'></i>",
        tip: "",
        click: () => {
            rule.value = '0'
        },
    }]
    menusEvent(event, list, '');
}

//播放模式
export function contextMenuTrayMode(event: MouseEvent) {
    let list = [{
        label: '完整模式',
        icon: "<i class='iconfont icon-full'></i>",
        tip: "",
        click: () => {
            changeMode.value = 0
        },
    }, {
        label: 'mini模式',
        icon: "<i class='iconfont icon-minimize'></i>",
        tip: "",
        click: () => {
            changeMode.value = 1
        },
    }, {
        label: '最小化',
        icon: "<i class='iconfont icon-zuixiaohua'></i>",
        tip: "",
        click: () => {
            changeMode.value = 2
        },
    }]
    menusEvent(event, list, '');
}