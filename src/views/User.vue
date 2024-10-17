<script setup>

import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, getCurrentInstance, onMounted, reactive ,nextTick } from 'vue';
const tableData = ref([])
const { proxy } = getCurrentInstance()
const getUserData = async () => {
  const res = await proxy.$api.getUserData(config)
  tableData.value = res.list.map(item => ({
    ...item,
    sex: item.sex === "1" ? '男' : '女'
  }))
  config.total = res.count
}
const tableLabel = reactive([
  {
    prop: 'name',
    label: '姓名'
  },
  {
    prop: 'age',
    label: '年龄'
  },
  {
    prop: 'sex',
    label: '性别'
  },
  {
    prop: 'birth',
    label: '出生日期',
    width: 200
  },
  {
    prop: 'addr',
    label: '地址',
    width: 500
  },
])
const formInline = reactive({
  keyWord: ''
})
const config = reactive({
  name: '',
  total: 0,
  page: 1,
  id: ''
})
const handleSearch = () => {
  config.name = formInline.keyWord
  getUserData()
}
const handleChange = (page) => {
  config.page = page
  getUserData()
}
const handleDelete = (val) => {
  ElMessageBox.confirm("你确定要删除吗").then(async () => {
    await proxy.$api.deleteUser({ id: val.id })
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success'
    })
    getUserData()
  })
}
const action = ref('add')
const dialogVisible = ref(false)
const formUser = reactive({
  name:'',
  sex:'1',
  addr:'',
  age:'',
  birth:'',
  id:''
})
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})
const handleClose = ()=>{
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields() //重置表单
}
const handleCancel =()=>{
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields() //重置表单
}
//添加
const handleAdd =()=>{
  dialogVisible.value=true
  action.value='add'
}
//格式化处理日期
const timeFormat = (t)=>{
  let time = new Date(t)
  let year = time.getFullYear()
  let month = time.getMonth()+1
  let data = time.getDate()
  function add(m){
    return m < 10 ? "0" + m : m
  }
  return year + "-" + add(month) + "-" + add(data) 
}
const onSubmit =()=>{
  //先要校验
  proxy.$refs['userForm'].validate( async(valid)=>{
    if(valid){
      let res = null;
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
      if(action.value === 'add'){
        res = await proxy.$api.createUser(formUser)
      }else{
        res = await proxy.$api.updateUser(formUser)
      }
      if(res){
        dialogVisible.value=false
        proxy.$refs['userForm'].resetFields() //重置表单
        getUserData()
      }
    }else{
      ElMessage({
        showClose:true,  //	是否显示关闭按钮
        message:'请输入正确的内容',
        type:'error'
      })
    }
  })
}
//编辑
const handleUpdata = (val)=>{
  dialogVisible.value=true
  action.value='updata'
 
  nextTick(()=>{  //nextTick确保在正确的时机进行 DOM 操作
    Object.assign(formUser,{...val,sex:''+val.sex}) //assign对象合并，+''转为字符串
  })
}
onMounted(() => {
  getUserData()
})
</script>

<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column v-for="item in tableLabel" :key="item.prop" :width="item.width ? item.width : 125"
        :prop="item.prop" :label="item.label" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #="scope"> <!-- 通过插槽scope拿到数据 -->
          <el-button type="primary" size="small" @click="handleUpdata(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pager" background layout="prev, pager, next" size="small" :total="config.total"
      @current-change="handleChange" />
  </div>
  <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%" :before-close="handleClose">
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理
    dialogVisible=true显示对话框
    before-close点击关闭和点击外部时执行
    -->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;
  height: 520px;

  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }

  .el-table {
    width: 100%;
    height: 500px;
  }
}
.select-clearn{
  display: flex;
}
</style>