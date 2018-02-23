/**
 * Created by ZTC on 2017-10-7.
 */
var fd = require("formidable");
var controller = require("../controller/controller")
var users = require("../db/users");
var subjects = require("../db/subjects")
var posts = require("../db/posts")
var user_actives_infos = require("../db/user_actives_infos")
var fs = require("fs")
var path = require("path")

//首页
exports.showIndex = function(req,res){
    // 查询是否已经登录
    if (req.session.login) {
        res.render("index",{
            "login": "1", // 已经登录
            "username": req.session.username
        })
    } else {
        res.render("index",{
            "login": "2" // 未登录
        })
    }
}

//登陆页面
exports.showLogin = function(req,res){
    // 查询是否是从邮箱过来的登陆
    res.render("login")
}

// 登陆检查
exports.loginCheck = function(req,res){
    controller.loginCheck(req,res,function(data){
        res.send(data)
    })
}

// 邮箱有效性检测
exports.loginCheckEmail = function(req,res){
    controller.loginCheckEmail(req,res,function(status){
        console.log("status", status)
        switch(status){
            case '0':
                res.render("error",{
                    status: '没有此用户'
                })
                break;
            case '1':
                res.redirect("/");
                // res.render("index",{
                //     login: '1',
                //     username: req.session.username
                // })
                break;
            case '2':
                res.render("error",{
                    status: '密码错误'
                })
                break;
            case '3':
                res.render("error",{
                    status: '链接失效'
                })
                break;
            default:
                res.render("index")
        }
    })
}

//注册页面
exports.showRegister = function(req,res){
    res.render("register")
}

// 注册检查
exports.registerCheck = function(req,res){
    controller.registerCheck(req,res,function(data){
        res.send(data)
    })
}

//社区页面
exports.showCommunity = function(req,res){
    res.render("community")
}

//表白墙
exports.showWhiteWall = function(req,res){
    res.render("whiteWall")
}

// 生活休闲
exports.showLife = function (req, res) {
    res.render('life')
}

// selects数据
exports.selectOptions = function(req, res) {
    subjects.findData({}, function(result){
        if (result.length == 0){
            // 空数据
            res.send('0')
        } else {
            var str = JSON.stringify(result)
            res.send(str)
        }
    })
}

// 提交帖子
exports.submitPost = function(req, res) {
    controller.submitPost(req,res,function(data){
        res.send(data)
    })
}

// 图片上传
exports.imageUpload = function(req, res) {
    var form = fd.IncomingForm()
    form.uploadDir = path.normalize(__dirname+"/../postImages");
    form.parse(req, function(err, fields, files) {
        var oldpath = files.file.path;
        var time = Date.parse(new Date())
        var newpath = path.normalize(__dirname+"/../postImages/"+ time +"post.jpg");
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("0")
                console.log("图片上传失败")
                return;
            }
            console.log("图片上传成功")
            res.send(newpath)
        })
    })
}

// communtiy页面获取帖子内容
exports.getPosts = function(req, res) {
    var start = Number(req.query.start)
    var limit = Number(req.query.limit)
    posts.findDataSort({}, {time: 1}, start, limit,function(data){
        res.send(JSON.stringify(data))
    })
    // posts.findData({},function(data){
    //     if (data.length <= start) {
    //         console.log('return')
    //         // return
    //     }else {
    //         posts.findDataSort({}, {time: 1}, start, limit,function(data){
    //             res.send(JSON.stringify(data))
    //         })
    //     }
    // })
}

// 吧
exports.showSubject = function(req, res){
    res.render("subject")
}

// 个人信息请求 
exports.userInfo = function(req, res){
    if (req.session.username){
        users.findData({username: req.session.username} ,function(data){
            if (data == 0) {
                // 未注册
                res.send("0")
            } else {
                // 成功
                res.send(JSON.stringify(data[0]))
            }
        })
    } else {
        // 未登录
        res.send('1')
    }
}

// 我的
exports.showMine = function(req, res) {
    res.render("mine")
}

// 全部subjects
exports.showSubjectList = function(req, res){
    res.render("subjectList")
}

// 评论
exports.getComments = function(req, res) {
    // 根据post_id获取评论
    controller.getComments(req,res,function(data){
        res.send(JSON.stringify(data))
    })
}

// 提交comment
exports.commitComment = function(req, res) {
    controller.commitComment(req, res, function(data){
        console.log(data)
        res.send(data)
    })
}

// 赞
exports.giveHeart = function(req, res){
    var tag = Number(req.query.tag)
    user_actives_infos.updateData({
        user_name: req.session.username
    },{
        $push: {
            hearts: req.query.post_id
        }
    },function(data){
        console.log(data)
    })
}