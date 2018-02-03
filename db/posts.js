var db = require("./db.js");

// posts查找
exports.findData = function(data, callback){
    var posts = []
    db._connnection(function(db){
        db.collection("posts").find(data, function(err, cursor){
            if (err) {
                console.log('posts查找失败')
                db.close()
                return
            }
            cursor.each(function(error,doc){
                if(error){
                    console.log("posts数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    posts.push(doc)
                }else{
                    callback(posts)
                }
            })
        })
    })
}

// posts inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db){
        db.collection("posts").insert(obj, function(err, result) {
            if (err) {
                console.log("posts insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// posts remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db){
        db.collection("posts").remove(obj, function(err, result) {
            if (err) {
                console.log('posts remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// posts update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("posts").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('posts update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}