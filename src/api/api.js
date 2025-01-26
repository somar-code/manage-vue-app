//整个项目api的统一管理

import request from "./request";

export default{
    getTableData(){
        return request({
            url:"/home/getTableData",
            method:"get",
            mock:true
        })
    },
    getCountData(){
        return request({
            url:"/home/getCountData",
            method:"get",
            mock:true
        })
    },
    getChartData(){
        return request({
            url:"/home/getChartData",
            method:"get",
            mock:true
        })
    },
    getUserData(data){
        return request({
            url:"/user/getUserData",
            method:"get",
            data,
            mock:true
        })
    },
    deleteUser(data){
        return request({
            url:"/user/deleteUser",
            method:"get",
            data,
            mock:true
        })
    },
    addUser(params) {
        return request({
          url: '/user/addUser',
          method: 'get',
          data: params
        })
      },
    editUser(params) {
        return request({
          url: '/user/editUser',
          method: 'get',
          data: params
        })
      },
    getMenu(params) {
        return request({
          url: '/permission/getMenu',
          method: 'get',
          data: params
        })
      }
}