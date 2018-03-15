/**
 * Created by ZTC on 2017-10-7.
 */
var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require("express-session");

// 聊天室
var http = require("http").Server(app);
var io = require("socket.io")(http);

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

// 忘记密码页面
app.get("/forgetPassword", router.forgetPassword)

// 重置密码成功
app.get("/resetPwdSuccess", function(req, res){
    res.render("resetPwdSuccess")
})

// 忘记密码提交
app.post("/resetPassword", router.resetPassword)

// 登陆检查
app.post("/loginCheck",router.loginCheck)

// 登陆邮箱检测
app.get("/loginCheckEmail", router.loginCheckEmail)

// 注册页面
app.get("/register",router.showRegister);

// 注册检查
app.post("/registerCheck", router.registerCheck)

// 注册username是否重复
app.post("/checkUsername", router.checkUsername)

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

// 关注
app.post("/joinSubject", router.joinSubject)

// 获取评论
app.get("/getComments", router.getComments)

// 提交评论
app.post("/commitComment", router.commitComment)

// 赞
app.get("/giveHeart", router.giveHeart)

// 用户是否给💕
app.get("/isHeart", router.isHeart)

// 删除评论
app.post("/deleteReply", router.deleteReply)

// 表白墙
app.post("/whiteWall", router.whiteWall)

// 提交表白
app.post("/commitWhiteWall", router.commitWhiteWall)

// 查找用户的关注的吧
app.post("/getUserSubjects", router.getUserSubjects)

// 表白墙点赞
app.post("/heartToWhiteWall", router.heartToWhiteWall)

// 表白墙点赞初始化
app.get("/whiteWallIsHeart", router.whiteWallIsHeart)

// 表白墙提交
app.post('/commitWhiteWallComment', router.commitWhiteWallComment)

// 我的信息
app.get("/getMineInfo", router.getMineInfo)

// 修改头像
app.post("/changeAvator", router.changeAvator)

// update user's infomation
app.post("/commitUserInfo", router.commitUserInfo)

// EXIT
app.get("/exit", router.exit)

// 获取帖子
app.get("/initSubjects", router.initSubjects)

// 展示忘记密码页面
app.get("/showForgetPassword", router.showForgetPassword)

// 消息列表
app.post("/getInfos", router.getInfos)

// 实时聊天
app.get("/chat", function(req, res){
    res.render("chat")
})
io.on("connection",function(socket){
    socket.on("chat",function(msg){
        //console.log(msg);
        console.log(msg)
        io.emit("answer",msg);
    })
})



// 监听端口
http.listen(3000)