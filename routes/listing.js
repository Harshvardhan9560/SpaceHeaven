const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    }

    next();
};

// INDEX ROUTE

router.get("/", async (req, res, next) => {

    try {

        const alllisting = await Listing.find({});

        res.render("listings/index", { alllisting });

    } catch (err) {
        next(err);
    }
});


// NEW ROUTE

router.get("/new", (req, res) => {

    res.render("listings/new");

});


// SHOW ROUTE

router.get("/:id", async (req, res, next) => {

    try {

        const { id } = req.params;

        const listing =
            await Listing.findById(id).populate("reviews");

        if (!listing) {
            return res.send("Listing not found");
        }

        res.render("listings/show", { listing });

    } catch (err) {
        next(err);
    }
});




// CREATE ROUTE

router.post("/listings",validateListing, async (req, res, next) => {

    try {

        const newListing = new Listing(req.body.listing);

        await newListing.save();

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});


// EDIT ROUTE

router.get("/:id/edit", async (req, res, next) => {

    try {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.send("Listing not found");
        }

        res.render("listings/edit", { listing });

    } catch (err) {
        next(err);
    }
});


// UPDATE ROUTE

router.put("/:id", async (req, res, next) => {

    try {

        const { id } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing }
        );

        res.redirect(`/listings/${id}`);

    } catch (err) {
        next(err);
    }
});


// DELETE LISTING ROUTE

router.delete("/:id", async (req, res, next) => {

    try {

        const { id } = req.params;

        const deletedListing =
            await Listing.findByIdAndDelete(id);

        console.log(deletedListing);

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});


module.exports= router;