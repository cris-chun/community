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
app.use(express.static("./postImages"));
app.use(express.static("./avator"));

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

// 登陆邮箱检测
app.get("/loginCheckEmail", router.loginCheckEmail)

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

// 请求subjects下拉框
app.get("/selectOptions", router.selectOptions)
// 发布帖子
app.post("/submitPost", router.submitPost)
// 上传图片
app.post("/imageUpload", router.imageUpload)
// 获取post帖子 community展示post内容
app.get("/getPosts", router.getPosts)
// 个人信息请求
app.get("/userInfo", router.userInfo)

// 吧
app.get("/subject", router.showSubject)

// 我的
app.get("/mine", router.showMine)

// 全部subjects
app.get("/subjectList", router.showSubjectList)

// 获取评论
app.get("/getComments", router.getComments)

// 提交评论
app.post("/commitComment", router.commitComment)

// 赞
app.get("/giveHeart", router.giveHeart)

// 监听端口
app.listen(3000)