            //*************************************************//
            //*************************************************//
            //************    DATABASE MODELING   *************//
            //*************************************************//
            //*************************************************//


//SHORT DESCRIPTION OF IT UNDERNEATH

"use strict";
            
var mongoose = require('mongoose');

//connect to the mongoDB test database
let mongoServer = mongoose.connect("mongodb://localhost/test");
let db = mongoose.connection;

//error or success messages
db.on('error', console.error.bind(console, "connection error"));
db.once('open', console.log.bind(console, "Connection established"));

var UserSchema = new mongoose.Schema({
    userID: { 
        type: Number,
        min : 0
    },
    name: {
        first: {
            type    : String,
            required: true,
            trim    : true
        },
        last: { 
            type    : String,
            required: true,
            trim    : true            
        }
    },
    username    : String,
    homeID: {
        type    : Number,
        required: true
    }
});
var User = mongoose.model("User", UserSchema);

var HomeSchema = new mongoose.Schema({
    homeID  : {
        type    : Number,
        required: true,
        min     : 0
    },
    Address : String,
    roomIDs   : []
});
var Home = mongoose.model("Home", HomeSchema);

//SCHEMA NEEDS EDITING
var RoomSchema = new mongoose.Schema({
    roomID  : {
        type: Number,
        required: true,
        min: 0
    },
    roomName : String,
    ECDs    : [{
        category: String,
        energyClass : String,
        consumptionRate : String,
        age: Number         
    }],
    lightGroup : [{
        lightType : String,
        consumptionRate: String,
        quantity : Number
    }],
    homeID: Number
});
var Room = mongoose.model("Room", RoomSchema)


module.exports.User = User;
module.exports.Home = Home;
module.exports.Room = Room;