const igdb = require('igdb-api-node').default;
let igdapi = function(){
let client = null;
try {
    let key = require('./.gameDbConfig');
    console.log(key);
     client = igdb(key);
    
}catch(e){


}


return{

client :client

}

    
}
module.exports = igdapi();