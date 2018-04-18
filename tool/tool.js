
// 工具函数
// 时间转换函数
exports.showTime = function(callback) {
    var timestamp = new Date()
    console.log(timestamp)
    var y = timestamp.getFullYear()
    var M = parseInt(timestamp.getMonth() + 1)
    M = M >= 10  ? M : ('0' + M)
    var d = parseInt(timestamp.getDate())
    d = d >= 10 ? d : ('0' + d)
    var h = parseInt(timestamp.getHours())
    h = h >= 10 ? h : ('0' + h)
    var m = parseInt(timestamp.getMinutes())
    m = m >= 10 ? m : ('0' + m)
    var s = parseInt(timestamp.getSeconds())
    s = s >= 10 ? s : ('0' + s)
    callback(y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s)
 }
