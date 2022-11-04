# vite-vue3-music

[![Netlify Status](https://api.netlify.com/api/v1/badges/80056bf0-069e-440c-a736-1781a1132187/deploy-status)](https://app.netlify.com/sites/neteasemusic/deploys) ![License](https://camo.githubusercontent.com/8d9f0c2c8232cb73a75fe504626eefdd12aa61b7fb40a5a539fd8faed7bfe876/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f7472617a796e2f69656173654d757369632e7376673f7374796c653d666c61742d737175617265) ![](https://github.com/userZheng686/vite-vue3-music/workflows/Build/badge.svg)

仿网易云音乐，目前支持Web/客户端，客户端目前仅支持Windows端。以后会支持Mac，Linux端。

# 应用主页截图：

![homepage](https://raw.githubusercontent.com/userZheng686/vite-vue3-music/electron/docs/image/homepage.png)



# 功能：

- 桌面歌词（客户端）
- mini模式（客户端）
- 自定义托盘右键菜单（客户端）
- 任务栏缩略图，歌曲操作（客户端）
- 黑夜/白天模式
- 浏览器启动客户端（客户端）
- 最小化/最大化/关闭应用（客户端）
- 个性推荐，专属定制，歌手，列表模式切换，播客，视频，关注，话题，直播，私人FM，私信，本地歌曲匹配（客户端），音乐匹配（客户端），下载，最近播放，音乐云盘，收藏，歌单，粉丝，关注，动态，歌曲，搜索，高亮显示搜索关键词，资料设置
- 心动模式，下一首播放，上一首播放，列表/随机/单曲/顺序循环，单曲播放，播放全部（列表）
- 右键菜单，对于每一个页面都有不一样的右键菜单
- 首页栏目调整（组件拖拽）
- 启动页（客户端）
- 集成了Github的Action工作流
- ...

# 未来开发的功能:

- [ ] 音频可视化
- [x] 手动/自动检查更新
- [x] 自定义安装界面
- [x] 离线/在线检测与桌面通知
- [x] 拖拽播放
- [ ] 文件关联
- [ ] 快捷键（全局）
- [ ] ...

# 技术栈：

- Vue3 ：采用最新版本Vue3.2
- vue-router ：采用4.0.16版本
- pinia ：采用2.0.14版本，是下一代的Vuex
- axios ：采用0.27.2版本
- qrcode.vue ：采用3.3.3版本，用于生成二维码
- mitt ：采用3.0.0版本，类似于Event Bus
- element-plus ：采用2.2.6版本，是UI框架
- element-china-area-data : 采用5.0.2版本，实现省市区联动组件
- electron-store : 采用8.0.2版本，本地存储数据
- vueuse : 采用8.7.5版本，Vue的工具库
- vue3-menus : 采用1.1.2版本，主要用于菜单
- vuedraggable : 采用4.1.0版本，主要用于拖拽组件
- vite : 采用3.0.2版本，是Vue3的官方新脚手架
- typescript : 采用4.7.4版本
- sass : 采用1.52.3版本
- electron : 采用19.0.8版本，跨平台桌面构建工具
- ...

# 系统一些截图：

![loading](https://raw.githubusercontent.com/userZheng686/vite-vue3-music/electron/docs/image/loading.gif)

![page1](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page1.gif?raw=true)

![page2](https://raw.githubusercontent.com/userZheng686/vite-vue3-music/electron/docs/image/page2.png)

![page3](https://raw.githubusercontent.com/userZheng686/vite-vue3-music/electron/docs/image/page3.png)

![page4](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page4.png?raw=true)

![page5](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page5.gif?raw=true)

![page6](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page6.png?raw=true)

![page7](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page7.png?raw=true)

![page8](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page8.png?raw=true)

![page9](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page9.gif?raw=true)

![page10](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page10.png?raw=true)

![page11](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page11.png?raw=true)

![page12](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page12.gif?raw=true)

![page13](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page13.png?raw=true)

![page14](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page14.gif?raw=true)

![page15](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page15.gif?raw=true)

![page16](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page16.png?raw=true)

![page17](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page17.gif?raw=true)

![image-20221031205320010](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page18.png?raw=true)

![page19](https://github.com/userZheng686/vite-vue3-music/blob/electron/docs/image/page19.gif?raw=true)

# 如何开始：

## 前置要求

1. 先将后端（nodejs）项目拷贝下来，在本地运行，后端地址在[这里](https://github.com/userZheng686/NeteaseCloudMusicApi.git)（这个是根据[Binaryify](https://github.com/Binaryify)大佬的[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi.git)项目改过来的，里面新增了更客户端相关的很多接口）
2. 如果需要拓展接口，需要去研究下如何抓包，比如Fiddler

## web端

1. 首先将vite.config.ts里面相关electron模块和代码的都注释掉
2. 设置https证书，证书文件在keys文件夹里面，需要安装到本地（开发环境）
3. 运行起来(npm install && npm run dev)

## 客户端

1. ~~客户端环境比较特殊，目前使用的插件不能支持electron和vue一起打包，不然会出现require is not defined的问题。这里给的一个解决方案是分别新建两个文件夹，一个是electron-dist，另外一个是electron-build。dist用来放web端打包的代码，build用来存放electron打包的代码。之后都放到dist文件夹，使用npm run package来打包。（可以随你的需求更改打包方法）~~（已解决，目前使用npm run dist命令即可打包）
2. release下面存放文件夹，文件夹里面有安装包和可执行文件。一般测试就是用里面的可执行文件就行了。

# License

[The MIT License (MIT)](https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/LICENSE)