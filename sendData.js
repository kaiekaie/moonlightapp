var cmd=require('node-cmd');


let getDataFunction = function(data, callback){
    cmd.get(
        data,
        function(err, data, stderr){
    if(err)reject(err)
            callback(data);

        }
    );

}

let SendData  = new Promise((resolve, reject) => {
    
                        getDataFunction('node sendcmd.js', element =>{
    
                            let test = element.split("\n")
                            test.splice(0,2)
                            let testarray = [];
                            var modifiedArr = test.forEach((element,i) => {
                                if(element != ""){
                            
                                    let nr  = element.replace(/(\d\.\s)/gi,"");
                                    testarray.push(nr);
                              
                                 
                                }
                            });
                            resolve(testarray)
                      
                        })
        })

        let StartCmd  = function(file) {
                let script = `moonlight stream "${file}" -1080 -surround )`
                                getDataFunction(script, element =>{
                                    console.log(element);
                                })
                    }

    
        

module.exports = {
    
    SendData : SendData,
    StartCmd : StartCmd

}