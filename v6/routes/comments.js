var express = require("express");
var router = express.Router({mergeParams:true});// we passed it because we are accessing campground which is from another like campgrounds.js
var Campground = require("../models/campground");
var Comment                 = require("../models/comment");
var middleware = require("../middleware");
// middleware = require("../middleware/index.js")----> we can use both , but index name is special case because express defaultly takes file for index if not specified.


// Comments New Route
router.get("/new",middleware.isLoggedIn,function(req,res){
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
router.post("/",middleware.isLoggedIn,function(req,res){
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

//edit and update routes
//Update and Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err)
    res.redirect("/campgrounds");
        else
        {
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
})

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err)
        res.redirect("/campgrounds");
        else{
        res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        res.redirect("/campgrounds/"+req.params.id);
    })
})



module.exports = router;