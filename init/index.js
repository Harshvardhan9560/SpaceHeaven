const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/SpaceHeaven";

main()
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initdb();
}

async function initdb() {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("Database initialized");
}