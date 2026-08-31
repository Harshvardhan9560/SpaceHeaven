const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

router.get("/", async (req, res, next) => {
    try {
        const alllisting = await Listing.find({});
        res.render("listings/index", { alllisting });
    } catch (err) {
        next(err);
    }
});

router.get("/new", (req, res) => {
    res.render("listings/new");
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing
            .findById(id)
            .populate("reviews");

        if (!listing) {
            return res.send("Listing not found");
        }

        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
});

router.post("/", validateListing, async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);

        await newListing.save();

        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

router.get("/:id/edit", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error","Listing you requested not exist!");
            res.redirect("/listings");
        }

        res.render("listings/edit", { listing });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing }
        );

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});


router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        console.log(deletedListing);

        req.flash("success", "Listing deleted successfully!");

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});


module.exports = router;