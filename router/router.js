/**
 * Created by ZTC on 2017-10-7.
 */

var controller = require("../controller/controller")

//首页
exports.showIndex = function(req,res){
    res.render("index")
}
//登陆页面
exports.showLogin = function(req,res){
    res.render("login");
}

// 登陆检查
exports.loginCheck = function(req,res){
    controller.loginCheck(req,res,function(data){
        res.send(data)
    })
}

//注册页面
exports.showRegister = function(req,res){
    res.render("register")
}

//社区页面
exports.showCommunity = function(req,res){
    res.render("community")
}

//表白墙
exports.showWhiteWall = function(req,res){
    res.render("whiteWall")
}