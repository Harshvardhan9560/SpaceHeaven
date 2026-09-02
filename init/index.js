require("dotenv").config({ path: "../.env" });

console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

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

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a957f05eef020689522148c"
    }));

    await Listing.insertMany(initData.data);

    console.log("Database initialized");

    await mongoose.connection.close();
}