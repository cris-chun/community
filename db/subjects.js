var db = require("./db.js");

// subjects查找
exports.findData = function(data,callback){
    var subjects = [];
    data = data || {}
    db._connnection(function(db){
        db.collection("subjects").find(data,function(err,cursor){
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
                    subjects.push(doc)
                }else{
                    callback(subjects)
                }
            })
        })
    })
}

// subjects inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db){
        db.collection("subjects").insert(obj, function(err, result) {
            if (err) {
                console.log("subjects insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// subjects remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db){
        db.collection("subjects").remove(obj, function(err, result) {
            if (err) {
                console.log('subjects remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// subjects update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("subjects").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('subjects update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}
