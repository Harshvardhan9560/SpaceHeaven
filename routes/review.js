const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing");
const Review = require("../models/review");
const {validateReview, isLoggedIn} = require("../middleware");


// =========================
// VALIDATE REVIEW
// =========================

// const validateReview = (req, res, next) => {
//     console.log(req.params.id);

//     let { error } = reviewSchema.validate(req.body);

//     if (error) {

//         let errMsg = error.details
//             .map((el) => el.message)
//             .join(",");

//         throw new ExpressError(400, errMsg);

//     } else {
//         next();
//     }
// };


// =========================
// CREATE REVIEW
// =========================

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {

        let listing = await Listing.findById(req.params.id);

        let newReview = new Review(req.body.review);
         newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success","New Review Created");
        res.redirect(`/listings/${listing._id}`);

    })
);


// =========================
// DELETE REVIEW
// =========================

router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {

        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(
            id,
            {
                $pull: {
                    reviews: reviewId
                }
            }
        );

        await Review.findByIdAndDelete(reviewId);
         req.flash("success"," Review Deleted");
        res.redirect(`/listings/${id}`);

    })
);


module.exports = router;