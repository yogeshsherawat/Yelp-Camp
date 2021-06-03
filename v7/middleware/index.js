var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={
 
}
//  isLoggedIn funciton
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    return next();
    // we have to right req.flash line before redirecting page otherwise it wont work , even after doing this we have to handle it in routes further
    req.flash("error","Please Log IN first");
    res.redirect("/login");
};
   // middle ware for checking comment id
   middlewareObj.checkCommentOwnership=function(req,res,next){
    // checking if user is logged in or not??
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","comment not found");
            res.redirect("back");}
            else
            {
                //checking if logged in user is same user who has created given campground or not??
                    
                    if(foundComment.author.id.equals(req.user._id))
                    next();
                    else{
                    req.flash("error","you are not authorised to do that");
                        res.redirect("back");
                    }
            }
            }
        );}
    else{
        req.flash("error","you need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    // checking if user is logged in or not??
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
            req.flash("error","Campground Not found");
            res.redirect("back");
            }
            else
            {
                //checking if logged in user is same user who has created given campground or not??
                    
                    if(req.user._id.equals(foundCampground.author.id))
                    next();
                    else{
                        req.flash("you are not authorised to do that");
                        res.redirect("back");
                    }
            }
            }
        );}
    else{
        req.flash("error","you need to be logged in to do that");
        res.redirect("back");
    
    }
}


module.exports = middlewareObj;