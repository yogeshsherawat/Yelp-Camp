var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//  campgrounds page 
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        
            res.render("./campgrounds/campgrounds",{allCampgrounds:allCampgrounds});
    })
   // res.render("campgrounds",{campgrounds:campgrounds})
   // db.campgrounds.find() ---> to show all data 
})
// 
router.get("/new",middleware.isLoggedIn,function(req,res){
    
    res.render("./campgrounds/new");
})

// show template-->
// show page for individual campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){// find by id is used to find in data base and db.collections.drop to delete the contents of collections
        if(err)
            console.log(err);
        else{
            console.log(foundCampground);
            res.render("./campgrounds/show",{campground:foundCampground,currentUser:req.user});// passing current User, if current user is defined or undefined , if undefined means no buddy logged in , so to chck if some one is logged in or not
            
        }
    });
   
});

// post route for campgrounds
router.post("/",middleware.isLoggedIn,function(req,res){
    var name1 = req.body.name;
    var image1 = req.body.image;
    var description1 = req.body.description;
    var author = {
        id:req.user._id,
        username:req.username
    }
    Campground.create({
        name:name1,
        image:image1,
        description:description1,
        author:author
    },function(err,newlyCreated){
        if(err)
        console.log(err);
        else{
        console.log(newlyCreated);
        res.redirect("/campgrounds");
    }}
    );
     
    
});
//Update and Edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err)
        res.redirect("/campgrounds");
        else
        {
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    })
})

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err,updatedCampground){
        if(err)
        res.redirect("/campgrounds");
        else{
        res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        res.redirect("/campgrounds");
    })
})



module.exports = router;