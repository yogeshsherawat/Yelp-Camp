var express = require("express"),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");
    Comment     = require("./models/comment");
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v3",{useNewUrlParser:true , useUnifiedTopology:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
seedDB();


app.get("/",function(req,res)
{
    res.render("landing");
})
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        
            res.render("./campgrounds/campgrounds",{allCampgrounds:allCampgrounds});
    })
   // res.render("campgrounds",{campgrounds:campgrounds})
   // db.campgrounds.find() ---> to show all data 
})
app.get("/campgrounds/new",function(req,res){
    
    res.render("./campgrounds/new");
})
// show template-->
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){// find by id is used to find in data base and db.collections.drop to delete the contents of collections
        if(err)
            console.log(err);
        else{
            console.log(foundCampground);
            res.render("./campgrounds/show",{campground:foundCampground});
            
        }
    });
   
});
app.post("/campgrounds",function(req,res){
    var name1 = req.body.name;
    var image1 = req.body.image;
    var description1 = req.body.description;
    Campground.create({
        name:name1,
        image:image1,
        description:description1
    },function(err,campground){
        if(err)
        console.log(err);
        else{
        console.log(campground);
        res.redirect("/campgrounds");
    }}
    );
     
    
})
// -----------------------
// -----------------------
// Comments Route 
app.get("/campgrounds/:id/comments/new",function(req,res){
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
app.post("/campgrounds/:id/comments",function(req,res){
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
                    {
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/"+campground._id);
                    }
            })
        }
    })
})

app.listen(3000,'127.0.0.1',function(){
    console.log("running");
});