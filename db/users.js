/**
 * Created by ZTC on 2017-10-7.
 */
var client = require("./db.js");

client.query("use " + 'community');

var results  = {
  LoginCheck: function(callback) {
    client.query(
      'SELECT * FROM '+'users',
      function selectCb(err, result, fields) {
        if (err) {
          throw err;
        }
        client.end();
        callback(result)
      }
    );
  }
}

module.exports = results;






