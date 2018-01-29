/**
 * Created by ZTC on 2017-11-26.
 */
var users = require("./users.js");

// 查找user中的所有数据
users.findData({},function(users){
    console.log(users);
})
// 根据username查找password
users.findData({username:"ztchun"},function(data){
    console.log(data)
})
