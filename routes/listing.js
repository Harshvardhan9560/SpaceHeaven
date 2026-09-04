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
router.get("/new", isLoggedIn, listingController.renderNewForm
);

// SHOW - show one listing
router.get("/:id", wrapAsync(listingController.showListing));


// CREATE - create listing
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));





// EDIT - edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE - update listing
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE - delete listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;  