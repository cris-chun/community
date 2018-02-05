/**
 * Created by ZTC on 2017-11-26.
 */
// controller

var fd = require("formidable");
var users = require("../db/users");
var nodemailer = require("nodemailer");

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
                        req.session.login = true
                        req.session.username = data[0].username
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

// 登陆邮箱验证
exports.loginCheckEmail = function(req,res,callback) {
    var username = req.query.username
    var password = req.query.password
    var timestamp = Number(req.query.timestamp) + 24*60*60*1000  // 在时间戳的基础上加上24小时
    var now = Date.parse(new Date())
    console.log(username, password, timestamp, now)
    if (timestamp > now) {
        users.findData({
            username: username
        },function(result) {
            if (result.length == 0) {
                // 没有此用户
                users.deleteData({
                    username: username
                },function(result){
                    callback("0")
                })
            } else {
                if(result[0].password === password) {
                    // 登陆成功
                    users.updateData({
                        username: username
                    },{
                        check: true
                    },function(result){
                        req.session.login = true
                        req.session.username = result[0].username
                        callback('1')
                    })
                } else{
                    // 密码错误 2
                    users.deleteData({
                        username: username
                    },function(){
                        callback('2')
                    })
                }
            }
        })
    }else{
        // 链接失效
        users.deleteData({
            username: username
        },function(){
            callback('3')
        })
    }
}

// 注册业务
exports.registerCheck = function(req,res,callback) {
    var form = fd.IncomingForm()
    form.parse(req,function(err,fields){
        if(err){
            throw err
            return
        }
        var obj = {
            username: fields.username,
            password: fields.password,
            phone_number: fields.phoneNumber,
            sex: fields.sex,
            check: false,
            birthday: fields.birthday || '',
            city: fields.city || '',
            address: fields.address || '',
            email: fields.email,
            pwd_question: '',
            pwd_answer: '',
            avator: '',
            tag: 0, // 0：普通用户   1：管理员
            infos: 0,
            follows: [],
            posts: []
        }
        users.insertData(obj,function(data){
            if(data.result.ok == 1){
                console.log("注册成功")
                // 发送email
                // 时间戳
                var now = Date.parse(new Date())
                var href = 'http://localhost:3000/loginCheckEmail?username=' + fields.username + '&password=' +fields.password + '&timestamp=' + now
                // 发送方
                var transporter = nodemailer.createTransport({
                    service: 'qq',
                    auth: {
                        user: 'ztchun@qq.com',
                        pass: 'bsdhtkkqjkbyhaia'
                    }
                })
                // 接收方
                var mailOptions = {
                    from: 'ztchun@qq.com',
                    to: fields.email,
                    subject: '校园社区邮箱验证',
                    text: '您好，此邮件为校园社区的邮箱认证，点击下方链接认证邮箱有效性',
                    html: '<h2>您好，此邮件为校园社区的邮箱认证，请点击下方链接认证邮箱有效性</h2>' +
                    '<div><a href=\'' + href + '\'>链接</a></div>'
                }
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    }
                });
                callback('1')
            } else {
                console.log("注册失败")
                callback('2')
            }
        })

    })
}