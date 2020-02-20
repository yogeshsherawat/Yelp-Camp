var express = require("express");
var router = express.Router({mergeParams:true});// we passed it because we are accessing campground which is from another like campgrounds.js
var Campground = require("../models/campground");
Comment                 = require("../models/comment");

// Comments New Route
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){       
            console.log(err);
            res.redirect("/");
    }
        else
            res.render("./comments/new",{campground:foundCampground});

    })
    
});
// comment post method//
router.post("/",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
                console.log(err);
                res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                    console.log(err);
                else
                    {   comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        
                        console.log("-------------------------------------");
                        console.log(comment.author.username);
                        console.log("-------------------------------------");
                        res.redirect("/campgrounds/"+campground._id);
                    }
            })
        }
    })
});

//  isLoggedIn funciton
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};
module.exports = router;