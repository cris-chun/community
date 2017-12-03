/**
 * Created by ZTC on 2017-10-7.
 */
//首页
exports.showIndex = function(req,res){
    res.render("index")
}

exports.showLogin = function(req,res){
    res.render("login");
}

exports.showRegister = function(req,res){
    res.render("register")
}