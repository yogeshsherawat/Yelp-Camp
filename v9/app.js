    require('dotenv').config();
    var express = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    flash                   = require("connect-flash"),
    session                 = require("express-session");
    MongoStore = require('connect-mongo')(session);
    

    var campgroundRoutes = require("./routes/campgrounds");
    var indexRoutes = require("./routes/index");
    var commentRoutes = require("./routes/comments");

    var atlasUrl = process.env.MongoURI;
    mongoose.connect(atlasUrl,{useNewUrlParser:true , useUnifiedTopology:true});
      
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret:"My name is YKS",
    resave:false,
    store: new MongoStore({ url: atlasUrl }),
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // creating cookie
passport.deserializeUser(User.deserializeUser()); // breaking that cookie to get information

// to make current user globally availabile
// or passing currentUser to every file
app.use(function(req,res,next){
        res.locals.currentUser  = req.user;
        res.locals.error        = req.flash("error");
        res.locals.success      = req.flash("success");
        next();
})


app.get("/",function(req,res)
{
    res.render("landing");
})

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("App Started");
});
 