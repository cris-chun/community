/**
 * Created by ZTC on 2017-11-26.
 */
var users = require("./users.js");

users.findAllUsers({},function(users){
    console.log(users);
})
