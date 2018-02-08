var db = require("./db.js");

// posts查找
exports.findData = findData

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

// posts 排序
exports.findDataBySort = function(data, sort, start, limit, callback) {
    start = Number(start)
    limit = Number(limit)
    findData({},function(data){
        if (data.length <= start) {
            console.log('return')
            return
        }else {
            findDataSort({}, {time: 1}, 3, 2,function(data){
                console.log(data)
            })
        }
    })
}

// 排序
exports.findDataSort = findDataSort

function findDataSort(data, sort, start, limit, callback){
    var result = []
    db._connnection(function(db){
        var cursor = db.collection("posts").find(data).sort(sort).skip(start).limit(limit)
        cursor.each(function(err,doc){
            if(err){
                console.log("排序失败", err)
                db.close();
                return
            }
            //遍历游标 
            if(doc != null){
                result.push(doc);
            }else{
                //遍历结束，没有更多的文档了，那么这个时候就需要使用回调函数了
                callback(result);
            }
        })
    })
}

function findData(data, callback){
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