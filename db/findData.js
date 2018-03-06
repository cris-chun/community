var db = require("./db.js");

exports.findData = function(collection, obj, callback){
    var data = []
    db._connnection(function(db){
        db.collection(collection).find(obj, function(error, cursor){
            if (error){
                console.log("查询数据库"+collection+"失败")
                db.close()
                return
            }
            cursor.each(function(error,doc){
                if(error){
                    console.log("infos数据遍历失败");
                    db.close();
                    return;
                }
                if(doc){
                    data.push(doc)
                }else{
                    callback(data)
                }
            })
        })
    })
}