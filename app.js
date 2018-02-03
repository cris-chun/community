/**
 * Created by ZTC on 2017-10-7.
 */
var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require("express-session");

//session配置
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//use ejs
app.set("view engine","ejs");

//static resource
app.use(express.static("./public"));

//router
//收藏夹不请求 否则控制台会出现404错误
app.get("/favicon.ico",function(){
    return;
});

// 首页
app.get("/",router.showIndex);

// 登陆页面展示
app.get("/login",router.showLogin);

// 登陆检查
app.post("/loginCheck",router.loginCheck)

// 注册页面
app.get("/register",router.showRegister);

// 注册检查
app.post("/registerCheck", router.registerCheck)

// 主页面
app.get("/community",router.showCommunity);

// 表白墙页面
app.get("/whiteWall",router.showWhiteWall);

// 生活休闲
app.get("/life", router.showLife)


// 监听端口
app.listen(3000)