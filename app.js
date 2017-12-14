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

app.get("/",router.showIndex);
app.get("/login",router.showLogin);
app.get("/register",router.showRegister);
app.get("/community",router.showCommunity);


app.listen(3000)