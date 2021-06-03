// node js - js front end 


var express = require("express");
var app = express();
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine","ejs");
var campgrounds =[
    { name:"NainiTal" , image:"https://images.pexels.com/photos/2727483/pexels-photo-2727483.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Laddaq",image:"https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Coorg", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"}    
    ]
app.get("/",function(req,res)
{
    res.render("landing");
})
app.get("/campgrounds",function(req,res){
    
    res.render("campgrounds",{campgrounds:campgrounds})
})
app.get("/campgrounds/new",function(req,res){
    
    res.render("new");
})
app.post("/campgrounds",function(req,res){
    var name= req.body.name;
    var image = req.body.image;
    var newCampground = {name:name , image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
})

app.listen(3000,'127.0.0.1',function(){
    console.log("running");
});