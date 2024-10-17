<script setup>
import { ref, computed } from "vue";
import {useAllDataStore} from "@/stores/index.js"
import { useRoute,useRouter } from "vue-router";
const store = useAllDataStore()

const list = computed(()=>store.state.menuList)  //用computed可以实现响应式，确保数据变化时组件能够及时更新

const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))

const isCollapse = computed(()=>store.state.isCollapse)
const width = computed(()=>store.state.isCollapse ? "64px" : "180px")



const router = useRouter()
const route = useRoute()
const activeMenu = computed(()=>route.path)
//点击菜单
const handleMenu = (item)=>{
  router.push(item.path)
  store.selectMenu(item)
}

</script>

<template>
  <el-aside :width="width">
    <!-- collapse折叠 default-active页面加载时默认激活菜单的 index-->
    <el-menu 
    background-color="#545c64"
    text-color="#fff"
    :collapse="isCollapse"  
    :collapse-transition="false"
    :default-active="activeMenu"
    >
      <h3 v-show="!isCollapse">后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>
      <el-menu-item 
        v-for="item in noChildren" 
        :index="item.path" 
        :key="item.path"
        @click="handleMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path" 
        :key="item.path"
        >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item 
            v-for="(sumItem, subIndex) in item.children" 
            :index="sumItem.path" 
            :key="sumItem.path"
            @click="handleMenu(sumItem)"
          >
            <component class="icons" :is="sumItem.icon"></component>
            <span>{{ sumItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
.icons{
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu{
  border: none;
  h3{
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}
.el-aside{
  height: 100%;
  background-color: #545c64;
  // transition: all 0.5s;
}
</style>