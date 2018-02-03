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
        var username = fields.username
        var param = {}
        // 手机号的登陆
        if(username.length == 11 && (/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(username))){
            param = {
                phone_number: username
            }
        } else if (username.indexOf("@") >= 0) {
            param = {
                email: username
            }
        } else {
            param = {
                username: username
            }
        }
        users.findData(param,function(data){
            if(data.length == 0) {
                // 数据库中没有此用户，需要注册
                callback('0')
            } else {
                if(data[0].check == true) {
                    if(data[0].password === password) {
                        // 登陆成功
                        console.log("login success")
                        callback('1')
                    } else{
                        // 密码错误 2
                        console.log("login error")
                        callback('2')
                    }
                } else{
                    // 邮箱没有认证3
                    callback('3')
                }

            }
        })

    })
}

// 注册业务
exports.registerCheck = function(req,res,callback) {
    var form = fd.IncomingForm()
    form.parse(req,function(err,fields){
        if(err){
            throw err
            return
        }
        users.insertData(fields,function(data){
            if(data.result.ok == 1){
                callback('1')
            } else {
                callback('2')
            }
        })

    })
}