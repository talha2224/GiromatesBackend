const mongoose = require('mongoose');
mongoose.set('strictPopulate',false)
const dbConnection = async()=>{
    let connection = await mongoose.connect(process.env.MONGOURL)
    if (connection){
        console.log(`db connected`)
    }
    else{
        console.log(`db not connected`)
    }
}

module.exports = {dbConnection}