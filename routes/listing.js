const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
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

router.route("/")
.get( wrapAsync(listingController.index))
// .post( isLoggedIn, validateListing, 
//     wrapAsync(listingController.createListing));
.post( upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})

    // NEW - form
router.get("/new", isLoggedIn,
     listingController.renderNewForm
);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// EDIT - edit form
router.get("/:id/edit", isLoggedIn,
     isOwner,
     wrapAsync(listingController.renderEditForm));

module.exports = router;  