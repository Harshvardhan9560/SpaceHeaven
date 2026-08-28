const express = require("express");
const app = express();
const users = require("./routes/user.js");
const cookiesParser = require("cookie-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/getcookies", (req,res)=>{
    res.cookie("greet","hello");
    res.send("sent your cookies! ");
})

app.get("/greet" , (req,res)=>{
    let {name= "anonymous"} = req.cookies;
    res.send(`Hi,${name} root!`);
})




app.get("/", (req, res) => {
    console.dir(req.cookies);
    
  res.send("Hi, I am root!");

});

app.use("/users", users);
app.listen(3000, () => {

    console.log("server is listening to 3000");

});