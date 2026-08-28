const express = require("express");
const app = express();
const users = require("./routes/user.js");
const cookiesParser = require("cookie-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretecode"));

app.get("/gesignedcookies",(req,res)=>{
    res.cookie("made-IN","India",{signed:true});
    res.send("signed cookie send ");
});

app.get("/getcookies", (req,res)=>{
    res.cookie("greet","hello");
    res.send("sent your cookies! ");
})

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});


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