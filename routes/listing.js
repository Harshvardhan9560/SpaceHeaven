const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
// Validation middleware
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

// INDEX - show all listings
router.get("/", wrapAsync(listingController.index));


// NEW - form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// SHOW - show one listing
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate({
              path: "reviews",
              populate: {
              path: "author"
                  }
               })

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
});

// CREATE - create listing
router.post("/", isLoggedIn, validateListing, async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// EDIT - edit form
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing you requested does not exist!");
            return res.redirect("/listings");
        }

        res.render("listings/edit", { listing });
    } catch (err) {
        next(err);
    }
});

// UPDATE - update listing
router.put("/:id", isLoggedIn, isOwner, validateListing, async (req, res, next) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { runValidators: true }
        );

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});

// DELETE - delete listing
router.delete("/:id", isLoggedIn, isOwner, async (req, res, next) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

module.exports = router;  