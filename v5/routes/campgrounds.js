var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//  campgrounds page 
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        
            res.render("./campgrounds/campgrounds",{allCampgrounds:allCampgrounds});
    })
   // res.render("campgrounds",{campgrounds:campgrounds})
   // db.campgrounds.find() ---> to show all data 
})
// 
router.get("/new",isLoggedIn,function(req,res){
    
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
router.post("/",isLoggedIn,function(req,res){
    var name1 = req.body.name;
    var image1 = req.body.image;
    var description1 = req.body.description;
    var author = {
        id:req.user._id,
        username:req.username.username
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


//  isLoggedIn funciton
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};

module.exports = router;