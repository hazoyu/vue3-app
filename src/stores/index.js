import { defineStore } from "pinia";
import { ref,watch } from "vue";

function initState() {
  return {
    isCollapse:false, //折叠
    tags :[    //卡片
      {
        path:'/home',
        name:'home',
        label:'首页',
        icon:'home'
      },
      
    ],
    currentMenu:null, //面包屑导航
    menuList:[],      //菜单列表
    token:'',
    routerList : []
  };
}
export const useAllDataStore = defineStore('allData', () => {
 //ref类似于state属性
 //computed() 就是 getters
 //function() 就是 actions

  const state = ref(initState())

  //防止刷新后丢失数据，持久化存储
  watch(state,(newObj)=>{
    if (!newObj.token) return
    localStorage.setItem("store",JSON.stringify(newObj))
  },{
    deep:true  //深度监听
  })
  //点击菜单将菜单添加到tags
  function selectMenu(val){
    if (val.name === "home"){
      state.value.currentMenu = null
    }else {
      state.value.currentMenu = val
      let index = state.value.tags.findIndex(item=>item.name===val.name)
      index === -1 ? state.value.tags.push(val) : ''
    }
  }
  //删除卡片tag
  function updateTags(tag){
    let index = state.value.tags.findIndex(item=>item.name===tag.name)
    state.value.tags.splice(index,1)
  }
  //更新菜单
  function updateMenuList(val){
    state.value.menuList = val
  }

  //配置动态路由
  function addMenu(router,type){
    if(type === 'refresh'){
      if(JSON.parse(localStorage.getItem('store'))){
        state.value = JSON.parse(localStorage.getItem('store'))
        //
        state.value.routerList = [];
      }else{
        return;
      }
    }
    const menu = state.value.menuList
    const module = import.meta.glob("../views/**/*.vue") // 获取所有匹配路径的模块
    const routerArr = []
    menu.forEach((item)=>{
      if(item.children){
        item.children.forEach((val)=>{ 
          let url = `../views/${val.url}.vue`  // 构建子菜单项的组件路径
          val.component = module[url]   // 将模块对象中的对应组件赋值给子菜单项的 component 属性
          routerArr.push(...item.children)
        })
      } else {
        let url = `../views/${item.url}.vue`
        item.component = module[url]
        routerArr.push(item)
      }
    })
    //解决多账号登录问题
    state.value.routerList = []
    let routers = router.getRoutes() //获取所有路由
    routers.forEach(item=>{
      if (item.name == 'main' || item.name == 'login' || item.name == '404') {  //对已有的不做处理
        return 
      } else {
        router.removeRoute(item.name)  //移除新添加的路由
      }
    })


    routerArr.forEach((item)=>{
      // 将路由添加到主路由下，并将返回的路由对象添加到 state.value.routerList 中
      state.value.routerList.push(router.addRoute('main',item)) //addRoute会返回一个移除函数 
    })
  }
  
  function clean(){
    state.value.routerList.forEach(item=>{
      if (item) item()  // 调用移除函数
    })
    state.value = initState()
    //删除本地缓存
    localStorage.removeItem("store")
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    addMenu,
    clean,
  }
})