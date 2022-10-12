import { createApp } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import App from './App.vue'
import store from '@/store/index'
import btnAntiShake from '@/utils/directives/btnAntiShake'
import filter from '@/utils/directives/filter'
import brightenKeyword from '@/utils/directives/brightenKeyword'
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/css-vars.css'
import 'element-plus/theme-chalk/dark/css-vars.css'


// import 'default-passive-events'

const app = createApp(App)


// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//loading
let LoadingComponent = () => import('c/loading/loadingComponent.vue')

app.component('LoadingComponent', LoadingComponent)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}



/**注册全局消息提示弹窗 */
app.provide('message', ElMessage)

app.use(btnAntiShake).use(filter).use(brightenKeyword).use(store).use(router).mount('#app')


