



let JsonDB = require('node-json-db');
let db = new JsonDB("gameDb", true, false);
module.exports = {
    socketfun: function (server) {
        let gameisRunning = false;
        let io = require("socket.io").listen(server);
        let dataFromCommands = require("./sendData");
        let gdbc;
        let Games = [];
     
        
        const init = require("./igs");
        const client = init.client;

        let emitgame = setInterval(() => {
            if (gameisRunning) {
                io.sockets.emit("gameIsRunning", true);
                io.sockets.emit("message", "Game In progress");
            }
        }, 1000);


        let GetGamesFunction = function (callback) {
            
            dataFromCommands.SendData.then(function (data) {
            
                                data.forEach(element => {
                                    let object = {};
                                    object.game = element
                                    if (!element.includes("Steam")) {
                                     
                                        if (client) {
            
                                            client.games({
                                                search: element,
                                                limit: 1,
                                                offset: 0
                                            }, ['name',
                                                    'cover'
                                                ]).then(function (response) {
                                                    let data = response.body;
                                                    data.forEach((el) => {
                                                        let regex = new RegExp(el.name, "g")
            
                                                        if (el && el.cover.cloudinary_id) {
                                                            console.log(el.name);
                                                            let image = client.image({
                                                                cloudinary_id: el.cover.cloudinary_id
                                                            }, 'cover_big');
            
                                                            object.image = image;
                                                        }
            
                                                    })
                                                });
                                        }
                                    }
            
                                    Games.push(object);
                                });
            
            
                                setTimeout(() => {
                             
                                    db.push("/games", Games);
                                    callback(Games);
                                }, 800)
            
                            }).catch((err) => {
                                console.log(err)
                                socket.emit("message", "Error")
                            })
            
                        }
            
                        GetGamesFunction((data) => {
                            
                      
                          });
                     
        io.on("connection", function (socket) {
            try {
                var DbGames = db.getData("/games");
                console.log(DbGames);
                socket.emit("list", DbGames)
            } catch (e) {
      

            }
            socket.on("checkdata", function (data) {

                console.log(data)
            })
            socket.emit("hello", "hello")

       

            socket.on("sendControll",function(e){
                socket.broadcast.emit("controllFunction",e);
            })

            socket.on("endGame", function () {
                dataFromCommands.endGame(function () {
                    io.sockets.emit("message", "game Ended");
                    gameisRunning = false;
                })

            })
      

            socket.on("startGame", function (game) {
                socket.emit("message", "Starting Game");
                gameisRunning = true;
                dataFromCommands.StartCmd(game, function (data) {
                    gameisRunning = false;
                    io.sockets.emit("message", "game Ended");

                });


            });


        })

    }

}

