import { createApp } from 'vue'
import "@/assets/less/index.less"
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import "@/api/mock.js"
import api from '@/api/api'
import { useAllDataStore } from '@/stores'

import 'element-plus/dist/index.css'  //按需导入需要导入这个才可以使用ElMessage

function isRoute(to){
  return router.getRoutes().filter(item=>item.path === to.path).length>0 //有传进来的就>1返回true
}
router.beforeEach((to,from)=>{  //路由守卫 ，全局前置守卫to：到哪里去，from从哪里来
  if (to.path !== '/login' && !store.state.token){
    return {name:'login'}
  }
  if (!isRoute(to)){  
    return {name:'404'}
  }
})
const pinia = createPinia()
const app =createApp(App);

app.config.globalProperties.$api = api; //将一个全局属性添加到 Vue 应用实例中
app.use(pinia)
//持久化存储
const store = useAllDataStore()
store.addMenu(router,"refresh")

app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')