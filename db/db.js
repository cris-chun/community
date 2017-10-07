/**
 * Created by ZTC on 2017-10-7.
 */
var mysql = require('mysql');

// create the connection
var client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '960107',
});

// connect the mysql
client.connect(function(err){
    if(err){
        console.log("sorry,mysql connection is error");
        return;
    }
    console.log("mysql connection is successful")
});

module.exports = client;

