require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = process.env.ATLASDB_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs' , ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));


console.log("ATLASDB_URL exists:", !!process.env.ATLASDB_URL);
console.log("Mongo URL:", process.env.ATLASDB_URL ? "Present" : "Missing");




main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
// Root Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ======================
// INDEX ROUTE
// ======================
app.get("/listings", async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
});

// ======================
// NEW ROUTE
// ======================
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// ======================
// CREATE ROUTE
// ======================
app.post("/listings", async (req, res) => {
    console.log("BODY:", req.body);
    console.log("LISTING:", req.body.listing);

    const newListing = new Listing(req.body.listing);
    await newListing.save();

    res.redirect("/listings");
});
// ======================
// EDIT ROUTE
// ======================
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.send("Listing not found");
    }

    res.render("listings/edit", { listing });
});

// update route 

app.put("/listings/:id", async (req,res)=> {
    let {id} = req.params;
   await  Listing.findByIdAndUpdate(id, { ...req.body.listing});
   res.redirect(`/listings/${id}`);
} );


// delete route
app.delete("/listings/:id" , async(req,res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
    
});



// ======================
// SHOW ROUTE
// ======================
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.send("Listing not found");
    }

    res.render("listings/show", { listing });
});