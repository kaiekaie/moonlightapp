


var cmd = require('node-cmd');


let devenviroment = process.env.NODE_ENV && process.env.NODE_ENV.match('development') ? true : false;


let getDataFunction = function (data, callback) {

    cmd.get(
        data,
        function (err, data, stderr) {
            if (err) {callback(err)}else {

                callback(data);
            }
       

        }
    );

}

let SendData = new Promise((resolve, reject) => {

    let testarray = [];
    let dev = 'node sendcmd.js';
    let prod = 'moonlight list'
let fc = devenviroment ? dev : prod;
    setTimeout(() => {
  
        getDataFunction(fc, element => {
            console.log(element);
            if (typeof element === "string") {
                let test = element.split("\n")
                test.splice(0, 2)

                var modifiedArr = test.forEach((element, i) => {
                    if (element != "") {
                 
                        let nr = element.replace(/(\d\.\s)/gi, "");
                        testarray.push(nr);


                    }
                });

            } else {
                reject(element)
            }

            resolve(testarray)

        })
    }, 10)

})


let StartCmd = function (app, callback) {
    let script = `moonlight stream -app "${app}" -1080 -surround`;
    getDataFunction(script, (element) => {
        console.log(element);
        if(devenviroment){
            setTimeout(() => {

                callback("done")
            },10000)
        }else {
            callback("done")
        }
     
    })
}


let endGame = function (callback) {
    let script = `moonlight quit`;
    getDataFunction(script, (element) => {
        console.log(element);
        callback("done")
    })
}




module.exports = {

    SendData: SendData,
    StartCmd: StartCmd,
    endGame : endGame

}