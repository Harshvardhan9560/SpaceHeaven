if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { reviewSchema } = require("./schema.js");

const MONGO_URL = process.env.ATLASDB_URL;

// ---------------- SESSION ----------------

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// ---------------- EJS ----------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ---------------- MIDDLEWARE ----------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---------------- SESSION + FLASH ----------------

app.use(session(sessionOptions));
app.use(flash());

// ---------------- PASSPORT ----------------

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});


// ---------------- LOCALS ----------------

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
});

// ---------------- DATABASE ----------------

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// ---------------- HOME ----------------

app.get("/", (req, res) => {
    req.flash("error", "Page Not Found!");
   
});
// ---------------- ROUTES ----------------

app.use("/listings", listingsRouter);

app.use("/", userRouter);

// ---------------- REVIEW VALIDATION ----------------

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

app.use(
    "/listings/:id/reviews",
   
    reviewsRouter
);

// ---------------- 404 ----------------

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ---------------- ERROR HANDLER ----------------

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.stack);

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send({ statusCode, message });
});

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});