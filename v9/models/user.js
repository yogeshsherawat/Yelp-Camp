var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username : String,
    password : String

});
UserSchema.plugin(passportLocalMongoose);// this line is to inherit all the methods predefined in passport local mongoose to user schema
module.exports  = mongoose.model("User",UserSchema);