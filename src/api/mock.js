import Mock from "mockjs";
import homeApi from './mockData/home'
import userApi from './mockData/user'
import permissionApi from './mockData/permission'
//1 拦截的路径(正则)(局部匹配) 2 方法 3 制造出的假数据

Mock.mock(/api\/home\/getTableData/,"get",homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/,"get",homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/,"get",homeApi.getChartData);
Mock.mock(/api\/home\/getUserData/,"get",userApi.getUserList);
Mock.mock(/api\/user\/deleteUser/,"get",userApi.deleteUser);
Mock.mock(/api\/user\/createUser/,"post",userApi.createUser);
Mock.mock(/api\/user\/updateUser/,"post",userApi.updateUser);
Mock.mock(/api\/permission\/getMenu/,"post",permissionApi.getMenu);