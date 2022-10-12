import { cookie } from '@/localStorage/init'
import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw
} from 'vue-router'

let layout = () => import('@/views/Layout.vue')
let findMusic = () => import('@/views/findMusic.vue')
let podCaster = () => import('@/views/podCaster.vue')
let podCasterCategory = () => import('@/views/podCasterCategory.vue')
let video = () => import('@/views/video.vue')
let videoDetail = () => import('@/views/videoDetail.vue')
let mvAll = () => import('@/views/mvAll.vue')
let mvTopList = () => import('@/views/mvTopList.vue')
let mvDetail = () => import('@/views/mvDetail.vue')
let localDownload = () => import('@/views/localDownload.vue')
let recentPlaySong = () => import('@/views/recentPlaySong.vue')
let musicDisk = () => import('@/views/musicDisk.vue')
let broadCast = () => import('@/views/broadCast.vue')
let broadCastDetail = () => import('@/views/broadCastDetail.vue')
let collect = () => import('@/views/collect.vue')
let songMenuDetail = () => import('@/views/songMenuDetail.vue')
let updateSongMenuDetail = () => import('@/views/updateSongMenuDetail.vue')
let resourceComment = () => import('@/views/resourceComment.vue')
let resourceHotComment = () => import('@/views/resourceHotComment.vue')
let albumDetail = () => import('@/views/albumDetail.vue')
let look = () => import('@/views/look.vue')
let personalFM = () => import('@/views/personalFM.vue')
let rubbish = () => import('@/views/rubbish.vue')
let desktopLyric = () => import('@/views/desktopLyric.vue')
let desktopMini = () => import('@/views/desktopMini.vue')
let recommendPlaylist = () => import('@/views/recommendPlaylist.vue')
let artists = () => import('@/views/artists.vue')
let homePage = () => import('@/views/homePage.vue')
let event = () => import('@/views/event.vue')
let follow = () => import('@/views/follow.vue')
let followed = () => import('@/views/followed.vue')
let updateUserInformation = () => import('@/views/updateUserInformation.vue')
let dynamics = () => import('@/views/dynamics.vue')
let recommendUser = () => import('@/views/recommendUser.vue')
let topicDetail = () => import('@/views/topicDetail.vue')
let topicSoaring = () => import('@/views/topicSoaring.vue')
let newSong = () => import('@/views/newSong.vue')
let eventDetail = () => import('@/views/eventDetail.vue')
let search = () => import('@/views/search.vue')
let tray = () => import('@/views/tray.vue')
let privateContent = () => import('@/views/privateContent.vue')
import { ElMessage } from 'element-plus';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        redirect: '/findMusic',
        component: layout,
        children: [{
            path: '/findMusic',
            name: 'FindMusic',
            component: findMusic,
            meta : {
               
            }
        }, {
            path: '/podCaster',
            name: 'PodCaster',
            component: podCaster,
            meta : {
               
            }
        }, {
            path: '/category',
            name: 'Category',
            component: podCasterCategory,
            meta : {
                
            }
        }, {
            path: '/video/',
            name: 'Video',
            component: video,
            meta : {
               
            }
        }, {
            path: '/videoDetail',
            name: 'VideoDetail',
            component: videoDetail,
            meta : {
              
            }
        }, {
            path: '/mvAll',
            name: 'MvAll',
            component: mvAll,
            meta : {
               
            }
        }, {
            path: '/mvTopList',
            name: 'MvTopList',
            component: mvTopList,
            meta : {
               
            }
        }, {
            path: '/mvDetail',
            name: 'MvDetail',
            component: mvDetail,
            meta : {
                
            }
        }, {
            path: '/localDownload',
            name: 'LocalDownload',
            component: localDownload,
            meta : {
               
            }
        }, {
            path: '/recentPlaySong',
            name: 'RecentPlaySong',
            component: recentPlaySong,
            meta : {
               authorize : true 
            }
        }, {
            path: '/musicDisk',
            name: 'MusicDisk',
            component: musicDisk,
            meta : {
                authorize : true 
            }
        }, {
            path: '/broadCast',
            name: 'BroadCast',
            component: broadCast,
            meta : {
                authorize : true 
            }
        }, {
            path: '/broadCastDetail',
            name: 'BroadCastDetail',
            component: broadCastDetail,
            meta : {
               
            }
        }, {
            path: '/collect',
            name: 'Collect',
            component: collect,
            meta : {
                authorize : true 
            }
        }, {
            path: '/songMenuDetail',
            name: 'SongMenuDetail',
            component: songMenuDetail,
            meta : {
                
            }
        }, {
            path: '/updateSongMenuDetail',
            name: 'UpdateSongMenuDetail',
            component: updateSongMenuDetail,
            meta : {
                authorize : true 
            }
        }, {
            path: '/resourceComment',
            name: 'ResourceComment',
            component: resourceComment,
            meta : {
                authorize : true 
            }
        }, {
            path: '/resourceHotComment',
            name: 'ResourceHotComment',
            component: resourceHotComment,
            meta : {
               
            }
        }, {
            path: '/albumDetail',
            name: 'AlbumDetail',
            component: albumDetail,
            meta : {
               
            }
        }, {
            path: '/look',
            name: 'Look',
            component: look,
            meta : {
               
            }
        }, {
            path: '/personalFM',
            name: 'PersonalFM',
            component: personalFM,
            meta : {
                
            }
        }, {
            path: '/rubbish',
            name: 'Rubbish',
            component: rubbish,
            meta : {
                
            }
        }, {
            path: '/recommendPlaylist',
            name: 'RecommendPlaylist',
            component: recommendPlaylist,
            meta : {
           
            }
        }, {
            path: '/artists',
            name: 'Artists',
            component: artists,
            meta : {
                
            }
        }, {
            path: '/homePage',
            name: 'HomePage',
            component: homePage,
            meta : {
                authorize : true
            }
        }, {
            path: '/event',
            name: 'Event',
            component: event,
            meta : {
                authorize : true 
            }
        }, {
            path: '/follow',
            name: 'Follow',
            component: follow,
            meta : {
                authorize : true 
            }
        }, {
            path: '/followed',
            name: 'Followed',
            component: followed,
            meta : {
                authorize : true 
            }
        }, {
            path: '/updateUserInformation',
            name: 'UpdateUserInformation',
            component: updateUserInformation,
            meta : {
               authorize : true 
            }
        }, {
            path: '/dynamics',
            name: 'Dynamics',
            component: dynamics,
            meta : {
               authorize : true 
            }
        }, {
            path: '/recommendUser',
            name: 'RecommendUser',
            component: recommendUser,
            meta : {
                
            }
        }, {
            path: '/topicDetail',
            name: 'TopicDetail',
            component: topicDetail,
            meta : {
                authorize : true 
            }
        }, {
            path: '/topicSoaring',
            name: 'TopicSoaring',
            component: topicSoaring,
            meta : {
                authorize : true 
            }
        }, {
            path: '/newSong',
            name: 'NewSong',
            component: newSong,
            meta : {
                
            }
        }, {
            path: '/eventDetail',
            name: 'EventDetail',
            component: eventDetail,
            meta : {
                authorize : true 
            }
        }, {
            path: '/search',
            name: 'Search',
            component: search,
            meta : {
                
            }
        }, {
            path: '/privateContent',
            name: 'PrivateContent',
            component: privateContent,
            meta : {
                
            }
        }]
    },
    {
        path: '/desktopLyric',
        name: 'DesktopLyric',
        component: desktopLyric
    },
    {
        path: '/desktopMini',
        name: 'DesktopMini',
        component: desktopMini
    },
    {
        path: '/tray',
        name: 'Tray',
        component: tray
    },
    {
        path : '/:pathMatch(.*)',
        name : 'NoFind',
        redirect : '/findMusic'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


router.beforeEach((to, from, next) => {
    if(to.meta.authorize){
      if(!Object.keys(cookie.value).length) {
        ElMessage.warning('请先登录 在完成后续操作')
        next('/findMusic')
      } else {
        next()
        window.scrollTo(0, 0);
      }
    }else {
        next()
        window.scrollTo(0, 0);
    }
    
})

export default router
