module.exports.isLoggedIn = (req, res, next) =>{
    console.log(req.user);
    if(req.isAuthenticated()){
        next();
    }
    req.flash("error", "You must be sign in first!!!");
    res.redirect("/new/login");
}