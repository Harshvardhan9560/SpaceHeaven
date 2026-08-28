const express = require("express");

const router = express.Router();

// Index

router.get("/", (req, res) => {

    res.send("Get for users");

});

// show -users

router.get("/:id", (req, res) => {

    res.send("get for users");

});

// post-users

router.post("/", (req, res) => {

    res.send("post for users");

});

// delete-users

router.post("/:id", (req, res) => {

    res.send("Delete for users id");

});

module.exports = router;