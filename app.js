require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review");
const MONGO_URL = process.env.ATLASDB_URL;


// MIDDLEWARE

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));


// DATABASE

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


// ROOT ROUTE

app.get("/", (req, res) => {
    res.redirect("/listings");
});





// VALIDATE REVIEW

const validatereview = (req, res, next) => {

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

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews)




// 404 ROUTE — MUST BE LAST

app.all("/*splat", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );

});


// ERROR HANDLER — MUST BE LAST

app.use((err, req, res, next) => {

    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).send({
        statusCode,
        message
    });

});


// SERVER

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

    console.log(
        `Server is listening on port ${PORT}`
    );

});
