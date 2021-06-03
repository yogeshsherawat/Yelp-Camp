var express = require("express");
    app         = express();
    bodyparser  = require("body-parser");
    mongoose    = require("mongoose");
    
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true , useUnifiedTopology:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
var CampgroundSchema = new mongoose.Schema({ 
    name : String,
    image:String,
    description:String
});
/*
index
new 
create
*/
var Campground = mongoose.model("Campground",CampgroundSchema);


app.get("/",function(req,res)
{
    
    res.render("landing");
})
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        
        res.render("campgrounds",{allCampgrounds:allCampgrounds});
    })
   // res.render("campgrounds",{campgrounds:campgrounds})
   // db.campgrounds.find() ---> to show all data 
})
app.get("/campgrounds/new",function(req,res){
    
    res.render("new");
})
// show template-->
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){// find by id is used to find in data base and db.collections.drop to delete the contents of collections
        if(err)
        console.log(err);
        else
        res.render("show",{campground:foundCampground});

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

app.listen(3000,'127.0.0.1',function(){
    console.log("running");
});