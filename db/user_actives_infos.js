var db = require("./db.js");

// user_actives_infos查找
exports.findData = function(data, callback){
    var user_actives_infos = []
    db._connnection(function(db){
        db.collection("user_actives_infos").find(data, function(err, cursor){
            if (err) {
                console.log('user_actives_infos查找失败')
                db.close()
                return
            }
            cursor.each(function(error,doc){
                if(error){
                    console.log("user_actives_infos数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    user_actives_infos.push(doc)
                }else{
                    callback(user_actives_infos)
                }
            })
        })
    })
}

// user_actives_infos inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db){
        db.collection("user_actives_infos").insert(obj, function(err, result) {
            if (err) {
                console.log("user_actives_infos insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// user_actives_infos remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db){
        db.collection("user_actives_infos").remove(obj, function(err, result) {
            if (err) {
                console.log('user_actives_infos remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// user_actives_infos update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    db._connnection(function(db) {
        db.collection("user_actives_infos").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('user_actives_infos update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}