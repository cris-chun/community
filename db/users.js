/**
 * Created by ZTC on 2017-10-7.
 */
var db = require("./db.js");

// 查找users表中数据
exports.findData = function(data, callback) {
    var users = [];
    data = data || {}
    db._connnection(function(db) {
        db.collection("users").find(data, function(err, cursor) {
            if (err) {
                console.log("查询所有用户失败");
                db.close();
                return;
            }
            console.log("查询数据成功")
            cursor.each(function(error, doc) {
                if (error) {
                    console.log("用户数据遍历失败");
                    db.close();
                    return;
                }
                if (doc) {
                    users.push(doc)
                } else {
                    callback(users)
                }
            })
        })
    })
}

// 插入user
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db) {
        db.collection("users").insert(obj, function(err, result) {
            if (err) {
                console.log('插入user表失败')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// 删除user表内容
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db) {
        db.collection("users").remove(obj, function(err, result) {
            if (err) {
                consoe.log('删除user表失败')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// 更新user表内容
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("users").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log("更新users表失败", err)
                db.close()
                return
            }
            // console.log("更新users表成功")
            callback(result)
        })
    })
}