const mongoose = require("mongoose");
require("dotenv").config();

const {  MONGODB_URI } = process.env;

   const ConnectDB = async ()=>{

    try{
        const connection = await mongoose.connect(MONGODB_URI)
        console.log("MongoDB connected")
      
    }catch(error){
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = ConnectDB