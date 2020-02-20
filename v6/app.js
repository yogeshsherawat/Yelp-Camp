var express                 = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    Campground              = require("./models/campground"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    seedDB                  = require("./seeds"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment");

    var campgroundRoutes = require("./routes/campgrounds");
    var indexRoutes = require("./routes/index");
    var commentRoutes = require("./routes/comments");
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v4",{useNewUrlParser:true , useUnifiedTopology:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
//seedDB();  //seeding the database
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
    secret:"My name is YKS",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to make current user globally availabile
app.use(function(req,res,next){
        res.locals.currentUser  =req.user;
        next();
})


app.get("/",function(req,res)
{
    res.render("landing");
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.listen(3000,'127.0.0.1',function(){
    console.log("running");
});