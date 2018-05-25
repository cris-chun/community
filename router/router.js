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
var infos = require("../db/infos")
var school_news = require("../db/school_news")
var findData = require("../db/findData")
var fs = require("fs")
var path = require("path")
var ObjectID = require("mongodb").ObjectID
var tool = require("../tool/tool")

//首页
exports.showIndex = function(req, res) {
    // 查询是否已经登录
    if (req.session.login) {
        res.render("index", {
            "login": "1", // 已经登录
            "username": req.session.username
        })
    } else {
        res.render("index", {
            "login": "2" // 未登录
        })
    }
}

//登陆页面
exports.showLogin = function(req, res) {
    // 查询是否是从邮箱过来的登陆
    if (req.session.login) {
        // 已经登录 就直接跳转到首页
        res.redirect("/")
    } else {
        res.render("loginCopy")
    }
}

// 忘记密码页面
exports.forgetPassword = function(req, res) {
    res.render("forgetPassword")
}

// 重置密码
exports.resetPassword = function(req, res) {
    controller.resetPassword(req, res, function(data) {
        res.send(data)
    })
}

// 登陆检查
exports.loginCheck = function(req, res) {
    controller.loginCheck(req, res, function(data) {
        res.send(data)
    })
}

// 邮箱有效性检测
exports.loginCheckEmail = function(req, res) {
    controller.loginCheckEmail(req, res, function(status) {
        console.log("status", status)
        switch (status) {
            case '0':
                res.render("error", {
                    status: '没有此用户'
                })
                break;
            case 'register':
                res.redirect("/");
                // res.render("index",{
                //     login: '1',
                //     username: req.session.username
                // })
                break;
            case '2':
                res.render("error", {
                    status: '密码错误'
                })
                break;
            case '3':
                res.render("error", {
                    status: '链接失效'
                })
                break;
            case "reset":
                res.redirect("/resetPwdSuccess");
                break;
            default:
                res.render("index")
        }
    })
}

//注册页面
exports.showRegister = function(req, res) {
    res.render("registerCopy")
}

// 注册检查
exports.registerCheck = function(req, res) {
    controller.registerCheck(req, res, function(data) {
        res.send(data)
    })
}

// 注册检查是否有重复付username
exports.checkUsername = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("username检查出错")
            return
        }
        users.findData({}, function(data) {
            var check = true
            data.forEach((value, index) => {
                if (value.username == fields.username) {
                    check = false
                }
            })
            if (check) {
                res.send("1")
            } else {
                res.send("0")
            }
        })
    })
}

//社区页面
exports.showCommunity = function(req, res) {
    res.render("community")
}

//表白墙
exports.showWhiteWall = function(req, res) {
    res.render("whiteWall")
}

// 生活休闲
exports.showLife = function(req, res) {
    res.render('life')
}

// selects数据
exports.selectOptions = function(req, res) {
    subjects.findData({}, function(result) {
        if (result.length == 0) {
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
    controller.submitPost(req, res, function(data) {
        res.send(data)
    })
}

// 图片上传
exports.imageUpload = function(req, res) {
    var dir = "/../postImages/",
        time = Date.parse(new Date())
    var filePath = time + "post"
    uploadImage(req, res, dir, filePath)
}

function uploadImage(req, res, dir, filePath) {
    var form = fd.IncomingForm()
    form.uploadDir = path.normalize(__dirname + dir);
    form.parse(req, function(err, fields, files) {
        var oldpath = files.file.path;
        var time = Date.parse(new Date())
        var newpath = path.normalize(__dirname + dir + filePath + ".jpg");
        console.log(newpath)
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
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
    posts.findDataSort({}, { time: -1 }, start, limit, function(data) {
        res.send(JSON.stringify(data))
    })
}

function compare(prop) {
    return function(obj1, obj2) {
        var value1 = obj1[prop]
        var value2 = obj2[prop]
        if (value1 > value2) {
            return -1
        } else if (value1 < value2) {
            return 1
        } else {
            return 0
        }
    }
}

// 吧
exports.showSubject = function(req, res) {
    res.render("subject")
}

// 关注
exports.joinSubject = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log('关注失败')
            return
        }
        subjects.updateArray({
            _id: ObjectID(fields._id)
        }, {
            user_name: fields.user_name,
            avator: fields.avator
        }, function(data) {
            if (data.result.ok) {
                user_actives_infos.updateData({
                    user_name: fields.user_name
                }, {
                    $push: {
                        subjects: {
                            id: fields._id,
                            sign: 0
                        }
                    }
                }, function(data) {
                    res.send("1")
                })
            }
        })
    })
}

//  取消关注
exports.cancelJoinSubject = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(error, fields) {
        if (error) {
            console.log('取消关注失败')
            return
        }
        subjects.updateDeleteArray({
            _id: ObjectID(fields._id)
        }, {
            user_name: fields.user_name,
            avator: fields.avator
        }, function(data) {
            if (data.result.ok) {
                user_actives_infos.updateData({
                    user_name: fields.user_name
                }, {
                    $pull: {
                        subjects: {
                            id: fields._id,
                            sign: 0
                        }
                    }
                }, function(data) {
                    res.send("1")
                })
            }
        })
    })
}

// 个人信息请求 
exports.userInfo = function(req, res) {
    var username = req.query.username || req.session.username
    if (req.session.username) {
        users.findData({ username: username }, function(data) {
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
exports.showSubjectList = function(req, res) {
    res.render("subjectList")
}

// 评论
exports.getComments = function(req, res) {
    // 根据post_id获取评论
    controller.getComments(req, res, function(data) {
        res.send(JSON.stringify(data))
    })
}

// 提交comment
exports.commitComment = function(req, res) {
    controller.commitComment(req, res, function(data) {
        console.log(data)
        res.send(data)
    })
}

// 赞
exports.giveHeart = function(req, res) {
    // 修改用户下的点赞记录
    var tag = Number(req.query.tag)
    var isPush = {}
    if (tag == 1) {
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
    }, isPush, function(data) {
        if (data.result.ok) {
            // 修改post表中的数据
            posts.addNumber({
                _id: ObjectID(req.query.post_id)
            }, {
                hearts: tag
            }, function(result) {
                if (result.result.ok) {
                    res.send("1")
                } else {
                    res.send("0")
                }
            })
        } else {
            res.send("0")
        }
    })
}

// 已经点赞
exports.isHeart = function(req, res) {
    if (!req.session.username) {
        res.send("0")
        return
    }
    user_actives_infos.findData({
        user_name: req.session.username
    }, function(data) {
        res.send(JSON.stringify(data[0].hearts))
    })
}

// 删除评论
exports.deleteReply = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        replys.updateReplys({
            post_id: fields.post_id
        }, {
            $pull: {
                replys: {
                    from_user_name: fields.from_user_name,
                    to_user_name: fields.to_user_name,
                    time: fields.time,
                    content: fields.content
                }
            }
        }, function(data) {
            if (data.result.ok) {
                posts.addNumber({
                    _id: ObjectID(fields.post_id)
                }, {
                    reply_num: -1
                }, function(num) {
                    console.log(num.result.ok)
                    res.send("1")
                })
            }
        })
    })
}

// 表白墙
exports.whiteWall = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("表白墙查询失败")
            return
        }
        white_wall.findData({}, function(data) {
            res.send(JSON.stringify(data))
        })
    })
}

// 提交表白墙
exports.commitWhiteWall = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("提交表白失败")
            res.send("0")
            return
        }
        tool.showTime(function(time) {
            var from_user_name = ''
            fields.nick = fields.nick == 'false' ? false : true
            console.log(fields, req.session.username)
            if (fields.nick) {
                from_user_name = ''
            } else {
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
            }, function(data) {
                if (data.result.ok) {
                    res.send("1")
                } else {
                    res.send("0")
                }
            })
        })
    })
}

// 获取当前用户的关注的吧
exports.getUserSubjects = function(req, res) {
    var postCopy = []
    var subject_ids = []
    posts.findData({}, function(posts) {
        subjects.findDataByArr({
            user_name: req.session.username
        }, function(subjects) {
            subjects.forEach((value, index) => {
                subject_ids.push(value._id.toString().trim())
            })
            posts.forEach((value, index, array) => {
                if (subject_ids.indexOf(value.subject_id) >= 0) {
                    postCopy.push(value)
                }
            })
            res.send(JSON.stringify(postCopy))
        })
    })
}

// 表白墙点赞
exports.heartToWhiteWall = function(req, res) {
    controller.heartToWhiteWall(req, res, function(data) {
        res.send(data)
    })
}

// 表白墙点赞初始化
exports.whiteWallIsHeart = function(req, res) {
    if (!req.session.username) {
        res.send("0")
        return
    }
    user_actives_infos.findData({
        user_name: req.session.username
    }, function(data) {
        res.send(JSON.stringify(data[0].whiteWallHeart))
    })
}

// 表白墙评论提交
exports.commitWhiteWallComment = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("提交评论失败")
            res.send('0')
            return
        }
        tool.showTime(function(time) {
            white_wall.updateBy({
                _id: ObjectID(fields._id)
            }, {
                $push: {
                    replys: {
                        from_user_name: req.session.username,
                        to_user_name: fields.to_user_name,
                        content: fields.content,
                        time: time
                    }
                }
            }, function(data) {
                if (data.result.ok) {
                    var obj = JSON.stringify({
                        from_user_name: req.session.username,
                        to_user_name: fields.to_user_name,
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
exports.getMineInfo = function(req, res) {
    var index = req.query.tag,
        collection = "",
        obj = {},
        tag = ""
    switch (index) {
        case "4":
            collection = "users"
            obj = {
                username: req.session.username
            }
            break
        case "6":
            collection = "infos"
            obj = {
                to_user_name: req.session.username
            }
            break
        case "7":
            collection = "subjects"
            obj = {}
            break
        case "8":
            collection = "subjects"
            obj = {}
            break
        case "5":
            collection = "posts"
            obj = {
                user_name: req.session.username
            }
            break
        default:
            collection = "user"
    }
    findData.findData(collection, obj, function(result) {
        if (tag) {
            res.send(JSON.stringify(result[0][tag]))
        } else {
            res.send(JSON.stringify(result))
        }
    })
}

// 修改头像
exports.changeAvator = function(req, res) {
    var dir = "/../avator/"
    var filePath = req.query.username
    console.log(filePath)
    uploadImage(req, res, dir, filePath)
}

// update user's infomation
exports.commitUserInfo = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
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
        obj.sex = obj.sex == '1' ? "女" : "男"
        obj.check = obj.check == 'true' ? true : false
        console.log(obj)
        users.updateData({ username: fields.username }, obj, function(data) {
            console.log(data.result.ok)
            res.send("1")
        })
    })
}

//退出
exports.exit = function(req, res) {
    req.session.username = null
    req.session.login = false
    res.send("1")
}

// init subjects  关注的吧
exports.initSubjects = function(req, res) {
    var data = []
    subjects.findData({}, function(result) {
        res.send(JSON.stringify(result))
    })
}

// 忘记密码页面
exports.showForgetPassword = function(req, res) {
    res.render("/forgetPassword")
}

// 加载信息
exports.getInfos = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("查找信息失败")
            return
        }
        infos.findData({
            user_name: fields.user_name
        }, function(data) {
            res.send(JSON.stringify(data))
        })
    })
}

// 保存subject
exports.saveSubject = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log('保存subjects失败')
            return
        }
        console.log(fields)
        subjects.updateData({
            _id: ObjectID(fields._id)
        }, {
            subject_name: fields.subejct_name,
            subject_desc: fields.subject_desc
        }, function(data) {
            if (data.result.ok) {
                res.send("1")
            }
        })
    })
}

// 删除subjects
// exports.deleteSubject = function(req, res) {
//     var form = fd.IncomingForm()
//     form.parse(req, function(err, fields){
//         if (err){
//             console.log('删除subjects失败')
//             return
//         }
//         subjects.findData({
//             _id: ObjectID(fields._id)
//         },function(data) {
//             var follow_users = data[0].follow_users
//             for (let i = 0;i<follow_users.length; i++) {
//                 user_actives_infos.updateData({
//                     user_name: follow_users[i].user_name
//                 },{
//                     $pull: {

//                     }
//                 })
//             }
//         })
//         subjects.deleteData({
//             _id: ObjectID(fields._id)
//         },function(data){
//             if (data.result.ok) {
//                 // 关注的人删除

//             }
//         })
//     })
// }

// init subject
exports.initSubject = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log('init subject 失败')
            return
        }
        subjects.findData({
            _id: ObjectID(fields.id)
        }, function(data) {
            res.send(JSON.stringify(data))
        })
    })
}

// init post
exports.initPost = function(req, res) {
        var form = fd.IncomingForm()
        form.parse(req, function(err, fields) {
            if (err) {
                console.log(err)
                return
            }
            posts.findData({
                subject_id: fields.id
            }, function(data) {
                console.log(data)
                res.send(JSON.stringify(data))
            })
        })
    }
    // 签到
exports.sign = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("签到失败")
            return
        }
        user_actives_infos.findData({
            user_name: req.session.username
        }, function(data) {
            console.log(data)
            var subjects = []
            data[0].subjects.forEach((value, index) => {
                if (value.id == fields.id) {
                    var obj = {
                        id: fields.id,
                        sign: Number(value.sign) + 1
                    }
                    subjects.push(obj)
                } else {
                    subjects.push(value)
                }
            })
            user_actives_infos.updateData({
                user_name: req.session.username
            }, {
                $set: {
                    subjects: subjects
                }
            }, function(data) {
                if (data.result.ok) {
                    res.send('1')
                }
            })
        })
    })
}

// 校园新鲜事
exports.getNews = function(req, res) {
        school_news.findDataBySort({}, { time: -1 }, function(data) {
            res.send(JSON.stringify(data))
        })
    }
    // news desc
exports.getNewsDesc = function(req, res) {
        var form = fd.IncomingForm()
        form.parse(req, function(err, fields) {
            if (err) {
                console.log('新闻详情获取失败')
                return
            }
            school_news.findData({
                _id: ObjectID(fields.id)
            }, function(data) {
                res.send(JSON.stringify(data[0]))
            })
        })
    }
    //support
exports.giveSupport = function(req, res) {
        var form = fd.IncomingForm()
        form.parse(req, function(err, fields) {
            if (err) {
                console.log("错误")
                return
            }
            school_news.findData({
                _id: ObjectID(fields.id)
            }, function(data) {
                var supports = data[0].support
                tool.showTime(function(time) {
                    var support = {
                        user: req.session.username,
                        time: time
                    }
                    supports.push(support)
                    school_news.updateData({
                        _id: ObjectID(fields.id)
                    }, {
                        support: supports
                    }, function(data) {
                        if (data.result.ok) {
                            res.send("1")
                        }
                    })
                })
            })
        })
    }
    // news list
exports.newsList = function(req, res) {
    res.render("newsList")
}

//news replys
exports.newsSendMsg = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("更新新闻回复失败")
            return
        }
        tool.showTime(function(time) {
            var reply = {
                from_user_name: req.session.username,
                content: fields.content,
                avator: fields.avator,
                time: time
            }
            school_news.update({
                _id: ObjectID(fields.id)
            }, {
                $push: {
                    replys: reply
                }
            }, function(data) {
                if (data.result.ok) {
                    res.send(JSON.stringify(reply))
                }
            })
        })
    })
}

// 所有用户
exports.getUsers = function(req, res) {
    users.findData({}, function(data) {
        res.send(JSON.stringify(data))
    })
}

// 删除用户
exports.deleteUser = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("删除用户失败")
            res.send("0")
            return
        }
        users.deleteData({
            username: fields.username
        }, function(data) {
            if (data.result.ok) {
                res.send("1")
            }
        })
    })
}

// 删除吧
exports.deleteSubject = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("删除用户失败")
            res.send("0")
            return
        }
        subjects.deleteData({
            _id: ObjectID(fields.id)
        }, function(data) {
            if (data.result.ok) {
                res.send("1")
            }
        })
    })
}

// delete news
exports.deleteNews = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("删除用户失败")
            res.send("0")
            return
        }
        school_news.deleteData({
            _id: ObjectID(fields.id)
        }, function(data) {
            if (data.result.ok) {
                res.send("1")
            }
        })
    })
}

// upload news image
exports.changeNewsImage = function(req, res) {
    var dir = "/../public/newsImages/"
    var filePath = req.query.id
    uploadImage(req, res, dir, filePath)
}

// news ubmit
exports.submitNews = function(req, res) {
        var form = fd.IncomingForm()
        form.parse(req, function(err, fields) {
            if (err) {
                console.log("news update error")
                return
            }
            school_news.findData({
                _id: ObjectID(fields.id)
            }, function(data) {
                console.log('------------------', data, fields)
                var obj = Object.assign(data[0], {
                    title: fields.title,
                    time: fields.time,
                    hot: fields.hot
                })
                school_news.updateData({
                    _id: ObjectID(fields.id)
                }, obj, function(data) {
                    if (data.result.ok) {
                        res.send("1")
                    }
                })
            })
        })
    }
    // add news 
exports.addNews = function(req, res) {
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields) {
        if (err) {
            console.log("add news error")
            return
        }
        tool.showTime(function(time) {
            school_news.insertData({
                time: time.split(" ")[1],
                title: fields.title,
                content: fields.content,
                image: '',
                look: 0,
                like: 0,
                replys: [],
                owner: req.session.username,
                support: [],
                hot: fields.hot
            }, function(data) {
                if (data.result.ok) {
                    res.send("1")
                }
            })
        })
    })
}

// update subject
exports.updateSubject = function(req, res) {
        var form = fd.IncomingForm()
        form.parse(req, function(err, fields) {
            if (err) {
                console.log("更新subject err")
                return
            }
            subjects.updateData({
                _id: ObjectID(fields._id)
            }, {
                subject_name: fields.subject_name,
                subject_desc: fields.subject_desc,
                level: fields.level,
                subject_image: fields.subject_image,
                isShow: fields.isShow == 'true' ? true : false,
                class: fields.class || ''
            }, function(data) {
                if (data.result.ok) {
                    res.send("1")
                }
            })
        })
    }
    // change subject image
exports.changeSubjectImage = function(req, res) {
    var dir = "/../public/subjectsImages/"
    var filePath = req.query.id
    uploadImage(req, res, dir, filePath)
}
// 获取未读的动态消息
exports.getDongtaiInfos = function(req, res){
    var form = fd.IncomingForm()
    form.parse(req, function(err, fields){
        if (err){
            res.send("0")
            console.log("获取未读的动态消息 失败")
            return
        }
        replys.findData({},function(data){
            var infos = []
            data.forEach(value => {
                value.replys.forEach(value2 => {
                    if (value2.to_user_name = fields.to_user_name){
                        infos.push(value2)
                    }
                })
            })
            res.send(JSON.stringify(infos))
        })
    })
}