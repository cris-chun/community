var db = require("./db.js");

// infos查找
exports.findData = function(data, callback) {
    var infos = []
    db._connnection(function(db) {
        db.collection("infos").find(data, function(err, cursor) {
            if (err) {
                console.log('infos查找失败')
                db.close()
                return
            }
            cursor.each(function(error, doc) {
                if (error) {
                    console.log("infos数据遍历失败");
                    db.close();
                    return;
                }
                if (doc) {
                    infos.push(doc)
                } else {
                    callback(infos)
                }
            })
        })
    })
}

// infos inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db) {
        db.collection("infos").insert(obj, function(err, result) {
            if (err) {
                console.log("infos insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// infos remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db) {
        db.collection("infos").remove(obj, function(err, result) {
            if (err) {
                console.log('infos remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// infos update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("infos").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('infos update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

exports.updateDataBy = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    db._connnection(function(db) {
        db.collection("infos").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('infos update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}