/**
 * Created by ZTC on 2017-10-7.
 */
var fd = require("formidable");
var controller = require("../controller/controller")
var users = require("../db/users");
var subjects = require("../db/subjects")
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