var db = require("./db.js");

// school_news查找
exports.findData = function(data, callback) {
    var school_news = []
    db._connnection(function(db) {
        db.collection("school_news").find(data, function(err, cursor) {
            if (err) {
                console.log('school_news查找失败')
                db.close()
                return
            }
            cursor.each(function(error, doc) {
                if (error) {
                    console.log("school_news数据遍历失败");
                    db.close();
                    return;
                }
                if (doc) {
                    school_news.push(doc)
                } else {
                    callback(school_news)
                }
            })
        })
    })
}

// school_news inset
exports.insertData = function(obj, callback) {
    if (!obj) {
        return
    }
    db._connnection(function(db) {
        db.collection("school_news").insert(obj, function(err, result) {
            if (err) {
                console.log("school_news insert error")
                db.close()
                return
            }
            callback(result)
        })
    })
}

// school_news remove
exports.deleteData = function(obj, callback) {
    if (!obj) {
        return;
    }
    db._connnection(function(db) {
        db.collection("school_news").remove(obj, function(err, result) {
            if (err) {
                console.log('school_news remove error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// school_news update
exports.updateData = function(oldObj, newObj, callback) {
    if (!oldObj || !newObj) {
        return;
    }
    newObj = {
        $set: newObj
    }
    db._connnection(function(db) {
        db.collection("school_news").update(oldObj, newObj, function(err, result) {
            if (err) {
                console.log('school_news update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}

// sort 
exports.findDataBySort = function(data, sort, callback) {
        var result = []
        db._connnection(function(db) {
            var cursor = db.collection("school_news").find(data).sort(sort)
            cursor.each(function(err, doc) {
                if (err) {
                    console.log("校园新鲜事查找失败")
                    db.close()
                    return
                }
                // 遍历有效
                if (doc != null) {
                    result.push(doc)
                } else {
                    callback(result)
                }
            })
        })
    }
    // 更新回复
exports.update = function(old, newData, callback) {
    if (!old || !newData) {
        return;
    }
    db._connnection(function(db) {
        db.collection("school_news").update(old, newData, function(err, result) {
            if (err) {
                console.log('school_news update error')
                db.close()
                return
            }
            callback(result)
        })
    })
}