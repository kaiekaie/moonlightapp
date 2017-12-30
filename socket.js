


module.exports = {
    socketfun: function (server) {
        let io = require("socket.io").listen(server);
        let data = require("./sendData")


        io.on("connection",function(socket){
                socket.emit("hello","hello")
    
                data.SendData.then(function(data){
                    console.log(data)
                    socket.emit("list",data)
                })

                
                socket.on("startGame",function(game){
                        data.StartCmd(game,function(data){
                            socket.emit("gamestared","starting Game");

                        });

                });


        })

    }

}

