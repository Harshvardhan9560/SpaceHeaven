const express = require("express");
const app = express();
const path = require("path");

const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const listingRouter = require("../routes/listing.js");

const session = require("express-session");
const flash = require("connect-flash");


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));
app.use(flash());


// Flash messages
app.use((req, res, next) => {
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
});


// ================= ROUTES =================

// Register
app.get("/register", (req, res) => {

    let { name = "anonymous" } = req.query;

    req.session.name = name;

    if (name === "anonymous") {
        req.flash("error", "User not registered");
    } else {
        req.flash("success", "User registered successfully!");
    }

    res.redirect("/hello");
});


// Hello
app.get("/hello", (req, res) => {
    res.render("page.ejs", {
        name: req.session.name
    });
});


// Listings
app.use("/listings", listingRouter);


// Users
app.use("/users", users);


// Posts
app.use("/posts", posts);


// Server
app.listen(3000, () => {
    console.log("server is listening to 3000");
});