



let JsonDB = require('node-json-db');
let db = new JsonDB("gameDb", true, false);
module.exports = {
    socketfun: function (server) {
        let gameisRunning = false;
        let io = require("socket.io").listen(server);
        let data = require("./sendData")
        const igdb = require('igdb-api-node').default;
        const client = igdb('e46066d8643515eabdde6e9f76100b9c');

        io.on("connection", function (socket) {

            socket.on("checkdata",function(data){

                console.log(data)
            })
            socket.emit("hello", "hello")
            let Games = [];

            try{
                var DbGames = db.getData("/games");
                socket.emit("list", DbGames)
            }catch(e){
                GetGamesFunction((data) => {

                    socket.emit("list", data);

                });
                
            }



            let GetGamesFunction = function(callback){
               
                data.SendData.then(function (data) {
                    
                                    data.forEach(element => {
                                        let object = {};
                                        object.game = element
                                        if(!element.includes("Steam")){
                                     
                                        if (client) {
                                            client.games({
                                                search: element,
                                                limit: 1,
                                                offset: 0
                                            }, [     'name',
                                                    'cover'
                                                ]).then(function (response) {
                                                    let data = response.body;
                                                    data.forEach((el) =>{
                                                        let regex = new RegExp(el.name,"g")
                    
                                                        if(el && el.cover.cloudinary_id){
                                                            console.log(el.name);
                                                            let image =  client.image({
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
                                        db.push("/games",Games);
                                        callback(Games);
                                    },800)
                       
                                }).catch((err) => {
                                    console.log(err)
                                    socket.emit("message", "Error")
                                })

            }
      
            socket.on("endGame",function(){
                data.endGame(function(){
                    socket.emit("message", "game Ended");
                    gameisRunning = false;
                })

            })
let emitgame = setInterval(() => {
    if(gameisRunning){
        socket.emit("gameIsRunning", true);
        socket.emit("message", "Game In progress");
    }
},1000);
            socket.on("startGame", function (game) {
                socket.emit("message", "Starting Game");
                gameisRunning = true;
                data.StartCmd(game, function (data) {
                    gameisRunning = false;
                    socket.emit("message", "game Ended");
         
                });


            });


        })

    }

}

