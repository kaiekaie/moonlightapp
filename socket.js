


module.exports = {
    socketfun: function (server) {
        let io = require("socket.io").listen(server);
        let data = require("./sendData")


        io.on("connection",function(socket){
                socket.emit("hello","hello")
    
                data.SendData.then(function(data){
                    console.log(data)
                    socket.emit("list",data)
                }).catch((err) => {
                    console.log(err)
                    socket.emit("message","Error")
                })

                
                socket.on("startGame",function(game){
                   
                        data.StartCmd(game,function(data){
                            console.log("click")
                            socket.emit("message",data);

                        });















                });


        })

    }

}

