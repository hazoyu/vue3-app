<script setup>
import { getCurrentInstance,reactive } from "vue";
import { useRouter } from "vue-router";
import { useAllDataStore } from '@/stores';
const store = useAllDataStore()
const router = useRouter()
const {proxy} = getCurrentInstance()
const loginForm = reactive({
  username:'',
  password:''
})
//表单校验规则
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" },],
})
const handleLogin = async()=>{
  
  proxy.$refs['form'].validate(async(valid)=>{
    if(valid){
      const res = await proxy.$api.getMenu(loginForm)
      store.updateMenuList(res.menuList)
      store.state.token = res.token
      store.addMenu(router)
      router.push("/home")
      
    }
  })
}
</script>

<template>
  <div class="bode-login">
    <el-form :model="loginForm" class="login-container" ref="form" :rules="rules">
      <h1>欢迎登录</h1>
      <el-form-item prop="username">
        <el-input type="input"  placeholder="请输入账号" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"  placeholder="请输入密码" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.bode-login{
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/background.png");
  background-size: 100%;
  overflow: hidden;
  .login-container{
    width: 400px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    margin: 250px auto;
    h1{
      text-align: center;
      margin-bottom: 20px;
      color: #505450;
    }
    :deep(.el-form-item__content){
      justify-content: center;
    }
  }
}
</style>