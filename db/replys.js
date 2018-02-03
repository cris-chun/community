var db = require("./db.js");

// replys查找
exports.findData = function(data, callback){
    var replys = []
    db._connnection(function(db){
        db.collection("replys").find(data, function(err, cursor){
            if (err) {
                console.log('replys查找失败')
                db.close()
                return
            }
            cursor.each(function(error,doc){
                if(error){
                    console.log("replys数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    replys.push(doc)
                }else{
                    callback(replys)
                }
            })
        })
    })
}

// replys inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db){
        db.collection("replys").insert(obj, function(err, result) {
            if (err) {
                console.log("replys insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// replys remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db){
        db.collection("replys").remove(obj, function(err, result) {
            if (err) {
                console.log('replys remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// replys update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("replys").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('replys update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}