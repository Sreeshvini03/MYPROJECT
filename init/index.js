const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); //requiring model

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //copy this link from mongoosejs.com and at the end add db name

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({}); //clearing all the existing data from db
    initData.data = initData.data.map((obj) => ({...obj,owner: "65808525180d3e9e1898dd79"}));
    // await Listing.insertMany(initData.data); //initData itself is an obj and we're accesing clean data
    console.log("data was initialised");
}
initDB();
