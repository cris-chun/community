/**
 * Created by ZTC on 2017-10-7.
 */
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = "mongodb://127.0.0.1:27017/community";

// 连接数据库
exports._connnection = function(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("数据库连接失败");
            // db.close()
            console.log(err)
            return;
        }
        console.log("数据库连接成功");
        callback(db);
    });
}