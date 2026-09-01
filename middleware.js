module.exports.isLoggedIn = (req,res,next)=>{
   // redirecturl save 
   req.session.redirectUrl = req.originalUrl;
    
if (!req.isAuthenticated()) {
        req.flash("success", "Login in to Create listing!");
        return res.redirect("/login");
    }
    next();
}

module. exports. saveRedirectUrl = (req, res, next) =>{
if (req.session. redirectUrl) {
res. locals. redirectUrl = req.session.redirectUrl;
}
next();
};