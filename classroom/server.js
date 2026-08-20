const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("Hi,I am root!");
});

// Index 
app.get("/users" ,(req,res)=>{
    res.send("Get for users");
} );
 
//show -users
app.get("/users/:id" , (req,res)=>{
    res.send("get for users");
});

// post-users
app.post("/users", (req,res)=>{
    res.send("post for users");
})

// delete-users
app.post("/users/:id", (req,res)=>{
    res.send("Delete for users id");
})

//post
// Index  
app.get("/posts" ,(req,res)=>{
    res.send("Get for posts");
} );
 
//show -users
app.get("/posts/:id" , (req,res)=>{
    res.send("get for posts");
});

// post-users
app.post("/posts", (req,res)=>{
    res.send("post for posts");
})

// delete-users
app.post("/posts/:id", (req,res)=>{
    res.send("Delete for posts id");
})


app.listen(3000,()=> {
    console.log("server is listing to 3000");
})

