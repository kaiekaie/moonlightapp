

var cmd = require('node-cmd');


let getDataFunction = function (data, callback) {
    cmd.get(
        data,
        function (err, data, stderr) {
            if (err) callback(err)
            callback(data);

        }
    );

}

let SendData = new Promise((resolve, reject) => {
    let dev = 'node sendcmd.js';
    let testarray = [];
    let prod = 'moonlight list'
    let fc = process.env.NODE_ENV && process.env.NODE_ENV.match('development') ? dev : prod;
    console.log(fc);
    setTimeout(() => {
        getDataFunction(fc, element => {
            if (element) {
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
    let script = `moonlight stream -app "${app}" -1080 -surround`
    getDataFunction(script, element => {
        console.log(element);
        callback("done")
    })
}




module.exports = {

    SendData: SendData,
    StartCmd: StartCmd

}