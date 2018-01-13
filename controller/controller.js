/**
 * Created by ZTC on 2017-11-26.
 */
// controller

var fd = require("formidable");
var users = require("../db/users");

// 登陆业务
exports.loginCheck = function(req,res,callback){
    var form = fd.IncomingForm()
    form.parse(req,function(err,fields){
        if(err){
            throw err
            return
        }
        var password = fields.password
        users.findData({
            username: fields.username
        },function(data){
            if(data.length === 0) {
                // 数据库中没有此用户，需要注册
                callback(0)
            } else {
                if(data[0].password === password) {
                    // 登陆成功返回1
                    console.log("login success")
                    callback(1)
                } else{
                    // 登录失败 返回
                    console.log("login error")
                    callback("error")
                }
            }
        })

    })
}