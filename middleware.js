const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("./schema.js");
const Review = require("./models/review");
module.exports.isLoggedIn = (req,res,next)=>{
   // redirecturl save 
   req.session.redirectUrl = req.originalUrl;
    
if (!req.isAuthenticated()) {
        req.flash("success", "Login in to Create listing!");
        return res.redirect("/login");
    }
    next();
}

module. exports. saveRedirectUrl = (req, res, next) =>{
if (req.session. redirectUrl) {
res. locals. redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permission");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};
module.exports.validateReview = (req, res, next) => {
    console.log(req.params.id);

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);

    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        if (!review.author.equals(req.user._id)) {
            req.flash(
                "error",
                "You don't have permission to edit this review"
            );
            return res.redirect(`/listings/${id}`);
        }

        next();

    } catch (err) {
        next(err);
    }
};

