const mongoose = require('mongoose');
const initData = require("./data.js");
const listing = require('../models/listing.js');

main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})

async function main(){
       await mongoose.connect('mongodb://127.0.0.1:27017/roamly');
}
async function initDb(){
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
}
initDb();