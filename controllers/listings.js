const Listing = require("../models/listing");


module.exports.index=async (req, res, next) => {
    try {
        const alllisting = await Listing.find({});
        res.render("listings/index", { alllisting });
    } catch (err) {
        next(err);
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");}

module.exports.showListing = async (req, res, next) => {
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
}


module.exports.createListing=  async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "New Listing created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}

module.exports.renderEditForm =  async (req, res, next) => {
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
}

module.exports.updateListing = async (req, res, next) => {
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
}

module.exports.destroyListing=async (req, res, next) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}