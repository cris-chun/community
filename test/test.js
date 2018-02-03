/**
 * Created by ZTC on 2017-11-26.
 */
var users = require("../db/users.js");
var posts = require("../db/posts.js")

var usersData = require('./users.json')
var postsData = require("./posts.json")

// 查找user中的所有数据
// users.findData({},function(users){
//     console.log(users);
// })

// 根据username查找password
// users.findData({username:"ztchun"},function(data){
//     console.log(data[0]._id)
// })

// user 插入数据
// users.insertData(usersData[0], function(result){
//     if (result.result.ok == 1) {
//         console.log('插入users表成功')
//     }
// })

// user删除
// users.deleteData({username: 'ztc'}, function(result) {
//     console.log(result)
// })

// users更新
// users.updateData({username: 'ztchun'}, {username: 'ztc'}, function(result){
//     console.log(result)
// })

// posts insert
// posts.insertData(postsData[0],function(result){
//     console.log(result.result.ok)
// })

// posts find
// posts.findData({},function(result){
//     console.log(result)
// })

//posts update
// posts.updateData({"user_name": "ztchun"}, {"user_name": "ztc"}, function(result){
//     console.log(result.result.ok)
// })

// posts delete
posts.deleteData({user_name: "ztc"}, function(result) {
    console.log(result.result.ok)
})



