require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL = process.env.ATLASDB_URL;

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Atlas DB");

    await initdb();
}

async function initdb() {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("Database initialized");
    mongoose.connection.close();
}