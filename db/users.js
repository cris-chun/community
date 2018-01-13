/**
 * Created by ZTC on 2017-10-7.
 */
var db = require("./db.js");

// 查找users表中数据
exports.findData = function(data,callback){
    var users = [];
    data = data || {}
    db._connnection(function(db){
        db.collection("users").find(data,function(err,cursor){
            if(err){
                console.log("查询所有用户失败");
                db.close();
                return;
            }
            console.log("查询数据成功")
            cursor.each(function(error,doc){
                if(error){
                    console.log("用户数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    users.push(doc)
                }else{
                    callback(users)
                }
            })
        })
    })
}

