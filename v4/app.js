var express                 = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    Campground              = require("./models/campground"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    seedDB                  = require("./seeds"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment");
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v4",{useNewUrlParser:true , useUnifiedTopology:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
seedDB();
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
    secret:"My name is YKS",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
        res.locals.currentUser  =req.user;
        next();
})


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
            res.render("./campgrounds/show",{campground:foundCampground,currentUser:req.user});// passing current User, if current user is defined or undefined , if undefined means no buddy logged in , so to chck if some one is logged in or not
            
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
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
});

app.get("/register",function(req,res){
    res.render("register");
})
// handle sing up logicx    
app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
            
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })

    });
});

// handle login Logic
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){});

// Logout Route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
//  isLoggedIn funciton
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/login");
};

app.listen(3000,'127.0.0.1',function(){
    console.log("running");
});