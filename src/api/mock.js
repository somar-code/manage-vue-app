import Mock from 'mockjs'
import homeApi from './mockData/home'

//三要素：1、拦截的路径 2、请求方式 3、制造的假数据
import userApi from './mockData/user'
import menuApi from './mockData/permission'
Mock.mock(/api\/home\/getTableData/,"get",homeApi.getTableData)
Mock.mock(/api\/home\/getCountData/,"get",homeApi.getCountData)
Mock.mock(/api\/home\/getChartData/,"get",homeApi.getChartData)
Mock.mock(/api\/user\/getUserData/,"get",userApi.getUserList)
Mock.mock(/api\/user\/deleteUser/,"get",userApi.deleteUser)
Mock.mock(/api\/user\/addUser/,"get",userApi.createUser)
Mock.mock(/api\/user\/editUser/, "get",userApi.updateUser)
Mock.mock(/api\/permission\/getMenu/,"get",menuApi.getMenu)