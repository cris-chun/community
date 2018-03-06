/**
 * Created by ZTC on 2017-11-26.
 */
// controller

var fd = require("formidable");
var nodemailer = require("nodemailer");
var tools = require("../tool/tool")
var users = require("../db/users");
var subjects = require("../db/subjects")
var posts = require("../db/posts")
var replys = require("../db/replys")
var white_wall = require("../db/white_wall")
var user_actives_infos = require("../db/user_actives_infos")
var ObjectID = require("mongodb").ObjectID

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
                    },function(res){
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
            infos: 0
        }
        users.insertData(obj,function(data){
            if(data.result.ok == 1){
                console.log("注册成功")
                user_actives_infos.insertData({
                    user_name: fields.username,
                    posts:[],
                    subjects:[],
                    manager_subjects:[],
                    hearts:[],
                    share:[],
                    whiteWallHeart:[]
                },function(data){
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
                })
            } else {
                console.log("注册失败")
                callback('2')
            }
        })

    })
}

// 提交帖子
exports.submitPost = function(req, res, callback) {
    if (!(req.session.login && req.session.username)){
        // 未登录
        callback("0")
        return false
    }
    var form = fd.IncomingForm()
    form.parse(req,function(err,fields){
        if(err){
            throw err
            return
        }
        if (fields.radio == '1') {
            subjects.findData({
                "_id": ObjectID(fields.subject)
            },function(subject) {
                tools.showTime(function(time){
                    var obj = {
                       subject_id: fields.subject,
                       subject_name: subject[0].subject_name,
                       post_title: fields.title,
                       post_content: fields.content,
                       post_photos: fields['images[]'],
                       link: '',
                       user_name: req.session.username,
                       time: time
                    }
                    posts.insertData(obj,function(post){
                        if (post.result.ok == 1) {
                            users.findData({
                                username: req.session.username
                            },function(user){
                                var obj = {
                                    avator: user[0].avator,
                                    username: user[0].username,
                                    subject: subject[0].subject_name,
                                    time: time,
                                    text: fields.content,
                                    images: fields['images[]']
                                }
                                callback(JSON.stringify(obj))
                            })
                        } else {
                            callback("2")
                        }
                    })
                })
            })
        } else {
            // 新增主题
            tools.showTime(function(time){
                var obj = {
                   subject_id: fields.subject,
                   subject_name: fields.subject,
                   post_title: fields.title,
                   post_content: fields.content,
                   post_photos: fields['images[]'],
                   link: '',
                   user_name: req.session.username,
                   time: time
                }
                // 插入主题数据库
                subjects.insertData({
                    subject_name: fields.subject,
                    subject_desc: fields.desc,
                    time: time
                }, function(result){
                    // 插入帖子数据库
                    posts.insertData(obj,function(post){
                        if (post.result.ok == 1) {
                            // 查询头像
                            users.findData({
                                username: req.session.username
                            },function(user){
                                var obj = {
                                    avator: user[0].avator,
                                    username: user[0].username,
                                    subject: fields.subject,
                                    time: time,
                                    text: fields.content,
                                    images: fields['images[]']
                                }
                                // 将数据返回
                                callback(JSON.stringify(obj))
                            })
                        } else {
                            callback("2")
                        }
                    })
                })
                
            })
        }
    })
}

// 评论
exports.getComments = function(req, res, callback) {
        //根据id查询评论
    replys.findData({
        "post_id": req.query.post_id
    }, function(data){
        if (data.length == 0 ){
            callback(0)
        } else {
            callback(data[0])
        }
    })
}

// 提交评论
exports.commitComment = function(req, res, callback) {
    var form  = fd.IncomingForm()
    form.parse(req, function(err, fields){
        console.log(req.session.username, fields.post_user_name)
        tools.showTime(function(time){
            // 更新replys
            replys.updateReplys({
                post_id: fields.post_id
            },{
                $push: {
                    replys: {
                        from_user_name : req.session.username, 
                        to_user_name : fields.post_user_name, 
                        time : time, 
                        content: fields.content 
                    }
                }
            },function(data){
                if(data.result.ok){
                    // 更新posts
                    posts.addNumber({
                       _id: ObjectID(fields.post_id) 
                    },{
                        reply_num: 1
                    },function(num){
                        console.log(num.result.ok)
                        callback("1")
                    })
                }else {
                    callback("0")
                }
            })
        })
    })
}

// 表白墙点赞
exports.heartToWhiteWall = function(req, res, callback){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        var newObj = {},isPush = {}
        if (fields.tag == 1){
            newObj = {
                $push: {
                    support: req.session.username
                }
            }
            isPush = {
                $push: {
                    whiteWallHeart: fields.id
                }
            }
        }else{
            newObj = {
                $pull: {
                    support: req.session.username
                }
            }
            isPush = {
                $pull: {
                    whiteWallHeart: fields.id
                }
            }
        }
        white_wall.updateBy({
            _id: ObjectID(fields.id)
        },newObj,function(data){
            if (data.result.ok){
                user_actives_infos.updateData({
                    user_name: req.session.username
                },isPush, function(result){
                    if (result.result.ok){
                        callback("1")
                    }
                })
            }else{
                callback("0")
            }
        })
    })
}
    