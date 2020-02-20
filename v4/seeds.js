var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
// purpose of making seeds file is to check for comment model and campground model is working correctly or not. 
// this way we can check beforehand if we have done some mistake while making models.
var data = [
    {
        name : "New 1"  ,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ5vTj2A2NF7paxMPg5vrbilAJDLEfEupPTjDPdzZnE_Mx3OgqK",
    description:"cool place"
    },
    {
        name : "New 2"  ,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT4ligIzTsiCi1dUPUkLhYyHTWUWoLlVisnpoAu5yZOtX2GZOm9",
    description:"cool super place"
    },
    {
        name : "New 3"  ,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTd5kxL-LfZN1_ehtIqUzI13zx6hciCpwMl6J2_xhqY4Nkqt8nb",
    description:"cool not place"
    }
]
function seedDB(){
Campground.remove({},function(err){
        if(err)
            console.log(err);
        else
            console.log("campground removed");
            data.forEach(function(data){
                Campground.create(data,function(err,campground){
                    if(err)
                        console.log(err);
                    else{
                        console.log("campground created");
                        Comment.create({
                            text:"Wow what a place!!!",
                            author:"Loner"
                        },function(err,comment){
                            if(err)
                                console.log(err);
                            else
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Campground Comment Added");
                        })
                    }// Creating new campground for each data item
                })
            })
    }
);
}
module.exports = seedDB;