var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={
 
}
//  isLoggedIn funciton
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};
   // middle ware for checking comment id
   middlewareObj.checkCommentOwnership=function(req,res,next){
    // checking if user is logged in or not??
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
            res.redirect("back");
            else
            {
                //checking if logged in user is same user who has created given campground or not??
                    
                    if(foundComment.author.id.equals(req.user._id))
                    next();
                    else
                    res.redirect("back");
                
            }
            }
        );}
    else
    res.redirect("back");
}

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    // checking if user is logged in or not??
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){
            if(err)
            res.redirect("back");
            else
            {
                //checking if logged in user is same user who has created given campground or not??
                    
                    if(foundCampground.author.id.equals(req.user._id))
                    next();
                    else
                    res.redirect("back");
                
            }
            }
        );}
    else
    res.redirect("back");
}


module.exports = middlewareObj;