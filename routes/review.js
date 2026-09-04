const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing");

const Review = require("../models/review");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const { createReview } = require("../controllers/review.js");
const reviewController = require("../controllers/review.js");

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
    wrapAsync(reviewController.createReview)
);


// =========================
// DELETE REVIEW
// =========================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;