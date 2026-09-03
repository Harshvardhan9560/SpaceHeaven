const Listing = require("../models/listing");


module.exports.index=async (req, res, next) => {
    try {
        const alllisting = await Listing.find({});
        res.render("listings/index", { alllisting });
    } catch (err) {
        next(err);
    }
}