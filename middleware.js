module.exports.isLoggedIn = (req,res,next)=>{
if (!req.isAuthenticated()) {
        req.flash("success", "Login in to Create listing!");
        return res.redirect("/login");
    }
    next();
}

