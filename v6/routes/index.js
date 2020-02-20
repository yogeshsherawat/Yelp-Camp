var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
//-----
//auth routes
//--
// we use index name also for authenticaiton routes
router.get("/register",function(req,res){
    res.render("register");
})
// handle sing up logicx    
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
            
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })

    });
});

// handle login Logic
router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){});

// Logout Route
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
//  isLoggedIn funciton
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};
module.exports = router;