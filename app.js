/**
 * Created by ZTC on 2017-10-7.
 */
var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require("express-session");

//session config
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//use ejs
app.set("view engine","ejs");

//static resource
app.use(express.static("./public"));
app.use(express.static("./avatar"));

//router
app.get("/favicon.ico",function(){
    return;
});
app.get("/",router.showIndex);
app.get("/login",router.showLogin)


app.listen(3000)