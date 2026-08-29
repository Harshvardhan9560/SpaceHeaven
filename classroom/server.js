const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretecode"));

// app.get("/gesignedcookies",(req,res)=>{
//     res.cookie("made-IN","India",{signed:true});
//     res.send("signed cookie send ");
// });

// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet","hello");
//     res.send("sent your cookies! ");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });


// app.get("/greet" , (req,res)=>{
//     let {name= "anonymous"} = req.cookies;
//     res.send(`Hi,${name} root!`);
// })




// app.get("/", (req, res) => {
//     console.dir(req.cookies);
    
//   res.send("Hi, I am root!");

// });

// app.use("/users", users);
// app.use("/posts",posts);
const session = require("express-session");

app.use(session({
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
}));


app.get("/reqcount",(req,res)=>{
   if(req.session.count){
    req.session.count++;
   }else{
    req.session.count=1;
   }
res.send(`you sent a request ${req.session.count} times`);
});

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

app.listen(3000, () => {

    console.log("server is listening to 3000");

});