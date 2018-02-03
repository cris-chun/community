var db = require("./db.js");

// white_wall查找
exports.findData = function(data, callback){
    var white_wall = []
    db._connnection(function(db){
        db.collection("white_wall").find(data, function(err, cursor){
            if (err) {
                console.log('white_wall查找失败')
                db.close()
                return
            }
            cursor.each(function(error,doc){
                if(error){
                    console.log("white_wall数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    white_wall.push(doc)
                }else{
                    callback(white_wall)
                }
            })
        })
    })
}

// white_wall inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db){
        db.collection("white_wall").insert(obj, function(err, result) {
            if (err) {
                console.log("white_wall insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// white_wall remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db){
        db.collection("white_wall").remove(obj, function(err, result) {
            if (err) {
                console.log('white_wall remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// white_wall update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("white_wall").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('white_wall update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}