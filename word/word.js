// app.js文件中引用io
var io = require("socket.io")(http);
io.on("connection", function(socket) {
    // 前台发送消息，就会触发chat时间
    socket.on("chat", function(msg) {
        // 将消息存到数据库中 存到发件人的消息库中  存到收件人的消息库中
        users.findData({
            username: msg.to_user_name
        }, function(data) {
            var message = {
                // message对象  此处省略
            }
            var message1 = Object.assign({ readed: true }, message)
            // 更新消息数据表
            infos.updateDataBy({
                user_name: msg.from_user_name,
            }, {
                $push: {
                    sendMsg: message1
                }
            }, function(data) {
                if (data.result.ok) {
                    var message2 = Object.assign({ readed: false }, message)
                    infos.updateDataBy({
                        user_name: msg.to_user_name
                    }, {
                        $push: {
                            receiveMsg: message2
                        }
                    }, function(data) {
                        if (data.result.ok) {
                            // 主动推送数据到前台
                            io.emit("answer", message);
                        }
                    })
                }
            })
        })
    })
})