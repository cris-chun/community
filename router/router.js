/**
 * Created by ZTC on 2017-10-7.
 */
var fd = require("formidable");
var controller = require("../controller/controller")
var users = require("../db/users");
var subjects = require("../db/subjects")
var posts = require("../db/posts")
var user_actives_infos = require("../db/user_actives_infos")
var replys = require("../db/replys")
var white_wall = require("../db/white_wall")
var findData = require("../db/findData")
var fs = require("fs")
var path = require("path")
var ObjectID = require("mongodb").ObjectID
var tool = require("../tool/tool")

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
    var dir = "/../postImages/" , time = Date.parse(new Date())
    var filePath = time + "post"
    uploadImage(req, res, dir, filePath)
}

function uploadImage(req, res, dir, filePath) {
    var form = fd.IncomingForm()
    form.uploadDir = path.normalize(__dirname+dir);
    form.parse(req, function(err, fields, files) {
        var oldpath = files.file.path;
        var time = Date.parse(new Date())
        var newpath = path.normalize(__dirname + dir + filePath + ".jpg");
        console.log(newpath)
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
    // 修改用户下的点赞记录
    var tag = Number(req.query.tag)
    var isPush = {}
    if (tag == 1){
        isPush = {
            $push: {
                hearts: req.query.post_id
            }
        }
    } else {
        isPush = {
            $pull: {
                hearts: req.query.post_id
            }
        }
    }
    // console.log(isPush)
    user_actives_infos.updateData({
        user_name: req.session.username
    }, isPush, function(data){
        if (data.result.ok){
            // 修改post表中的数据
            posts.addNumber({
                _id: ObjectID(req.query.post_id)
            },{
                hearts: tag
            },function(result){
                if(result.result.ok){
                    res.send("1")
                }else {
                    res.send("0")
                }
            })
        }else {
            res.send("0")
        }
    })
}

// 已经点赞
exports.isHeart = function(req, res){
    if (!req.session.username){
        res.send("0")
        return
    }
    user_actives_infos.findData({
        user_name: req.session.username
    },function(data){
        res.send(JSON.stringify(data[0].hearts))
    })
}

// 删除评论
exports.deleteReply = function(req, res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        replys.updateReplys({
            post_id: fields.post_id
        },{
            $pull: {
                reply: {
                    from_user_name : fields.from_user_name, 
                    to_user_name : fields.to_user_name, 
                    time : fields.time, 
                    content: fields.content 
                }
            }
        },function(data){
            if (data.result.ok){
                posts.addNumber({
                    _id: ObjectID(fields.post_id) 
                 },{
                     reply_num: -1
                 },function(num){
                     console.log(num.result.ok)
                     res.send("1")
                 })
            }
        })
    })
}

// 表白墙
exports.whiteWall = function(req, res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        if (err){
            console.log("表白墙查询失败")
            return
        }
        white_wall.findData({},function(data){
            res.send(JSON.stringify(data))
        })
    })
}

// 提交表白墙
exports.commitWhiteWall = function(req, res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        if (err){
            console.log("提交表白失败")
            res.send("0")
            return
        }
        tool.showTime(function(time){
            var from_user_name = ''
            fields.nick = fields.nick == 'false' ? false: true
            console.log(fields, req.session.username)
            if (fields.nick){
                from_user_name = ''
            }else{
                from_user_name = req.session.username
            }
            white_wall.insertData({
                from_user_name: from_user_name,
                to_user_name: '',
                support: [],
                time: time,
                content: fields.content,
                nick: fields.nick,
                replys: []
            },function(data){
                if (data.result.ok){
                    res.send("1")
                }else {
                    res.send("0")
                }
            })
        })
    })
}

// 获取当前用户的关注的吧
exports.getUserSubjects = function(req, res){
    var postCopy = []
    var subject_ids = []
    posts.findData({}, function(posts){
        subjects.findDataByArr({
            user_name: req.session.username
        },function(subjects){
            subjects.forEach((value, index) => {
                subject_ids.push(value._id.toString().trim())
            })
            posts.forEach((value, index, array) => {
                if(subject_ids.indexOf(value.subject_id) >= 0) {
                    postCopy.push(value)
                }
            })
            res.send(JSON.stringify(postCopy))
        })
    })
}

// 表白墙点赞
exports.heartToWhiteWall = function(req, res){
    controller.heartToWhiteWall(req, res, function(data){
        res.send(data)
    })
}

// 表白墙点赞初始化
exports.whiteWallIsHeart = function(req, res){
    if (!req.session.username){
        res.send("0")
        return
    }
    user_actives_infos.findData({
        user_name: req.session.username
    },function(data){
        res.send(JSON.stringify(data[0].whiteWallHeart))
    })
}

// 表白墙评论提交
exports.commitWhiteWallComment = function(req,res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        if (err){
            console.log("提交评论失败")
            res.send('0')
            return
        }
        tool.showTime(function(time){
            white_wall.updateBy({
                _id: ObjectID(fields._id)
            },{
                $push: {
                    replys: {
                        from_user_name: req.session.username,
                        to_user_name:fields.to_user_name,
                        content: fields.content,
                        time: time
                    }
                }
            },function(data){
                if (data.result.ok){
                    var obj = JSON.stringify({
                        from_user_name: req.session.username,
                        to_user_name:fields.to_user_name,
                        content: fields.content,
                        time: time
                    })
                    res.send(obj)
                }
            })
        })
    })
}

// 获取用户信息
exports.getMineInfo = function(req, res){
    var index = req.query.tag,collection="",obj={},tag = ""
    switch(index){
        case "4": 
            collection = "users"
            obj = {
                username: req.session.username
            }
            break
        case "8":
            collection = "infos"
            obj = {
                to_user_name: req.session.name
            }
            break
        case "5":
            collection = "user_actives_infos"
            tag = "manager_subjects"
            break
        case "6":
            collection = "user_actives_infos"
            tag = "subjects"
            break
        case "7":
            collection = "user_actives_infos"
            tag = "posts"
            break
        default:
            collection = "user"
    }
    findData.findData(collection, obj, function(result){
        if (tag) {
            res.send(JSON.stringify(result[tag]))
        }else{
            res.send(JSON.stringify(result))
        }
    })
}

// 修改头像
exports.changeAvator = function(req, res){
    var dir = "/../avator/" 
    var filePath = req.session.username
    uploadImage(req, res, dir, filePath)
}

// update user's infomation
exports.commitUserInfo = function(req, res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        if (err){
            console.log("完善用户信息出错")
            res.send("0")
            return
        }
        var obj = fields
        console.log(fields)
        obj.city = fields['city[]']
        delete obj['city[]']
        delete obj._id
        obj.city = obj.city[0] + '-' + obj.city[1]
        obj.sex = obj.sex == '1' ? "女":"男"
        obj.check = obj.check == 'true'?true:false
        console.log(obj)
        users.updateData({username: req.session.username}, obj, function(data){
            console.log(data.result.ok)
            res.send("1")
        })
    })
}