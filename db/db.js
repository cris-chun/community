/**
 * Created by ZTC on 2017-10-7.
 */
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/community';

// Use connect method to connect to the Server
exports._connnection =  function (callback){
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log("数据库连接失败");
            db.close()
            return;
        }
        console.log("数据库连接成功");
        callback(db);
    });
}


