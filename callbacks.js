"use strict";
//node modules
const http          = require('http');
const path          = require('path');
const mongoose      = require('mongoose');
const querystring   = require('querystring');
//custom modules
const pathHandler   = require('./pathHandler');
const models        = require('./models');
//data constants
const mongoPath     = "mongodb://localhost/test"

            //*************************************************//
            //*************************************************//
            //***********    SERVER FUNCTIONALITY   ***********//
            //*************************************************//
            //*************************************************//

const server = http.createServer();
//start the application server on next tick to ensure the event 
//loop runs at least once before the main thread is blocked
process.nextTick(function(){
    console.log("Server is listening");
    server.listen(8000)
});
//bind the path request handler to the application server
const handler = pathHandler.Handler(server);


            //*************************************************//
            //*************************************************//
            //***************    API DESIGN   *****************//
            //*************************************************//
            //*************************************************//
                   
                  
handler.addHandle('/', "GET", welcome);
handler.addHandle('/test', "GET", testResponse);
handler.addHandle('/users', "GET", getUsers);
handler.addHandle('/users', "POST", addUser);


            //*************************************************//
            //*************************************************//
            //************    API FUNCTIONALITY   *************//
            //*************************************************//
            //*************************************************//                   

function addUser(response, params) {   
    params = querystring.parse(params);    
    
    var user = new models.User({
        userID      : Number(params.userID),
        name        : { first: params.first, last: params.last},
        username    : params.username,
        homeID      : Number(params.homeID)
    });
    
    let status = save(user);
    sendStatus(status);    
}

function getUsers(response) {
    models.User.find( (err, users) => {
        if(err) {            
            return console.error(err);
        } else {            
            let reply = JSON.stringify(users);            
            response.end(reply);
        }
    });         
}   

function addHome(response, params) {   
    params = querystring.parse(params);    
    
    var home = new models.User({
        roomID      : Number(params.roomID),
        roomType    : params.roomType,
        roomName    : params.roomName,        
        homeID      : Number(params.homeID),        
    });
    let status = save(home);
    sendStatus(response);
};


function getHome(response) {
    models.Home.find( (err, homes) => {
        if(err) {            
            return console.error(err);
        } else {            
            let reply = JSON.stringify(users);            
            response.end(reply);
        }        
    });         
}   

function addECD(response, params) {   
    params = querystring.parse(params);    
    let room = params.roomID;
    
    let result = models.Room.findOne({ roomID: room });
    
    var home = new models.User({
        roomID      : Number(params.roomID),
        roomType    : params.roomType,
        roomName    : params.roomName,        
        homeID      : Number(params.homeID),        
    });
    let status = save(home);
    sendStatus(response);
};


function ECD(response) {
    models.Home.find( (err, homes) => {
        if(err) {            
            return console.error(err);
        } else {            
            let reply = JSON.stringify(users);            
            response.end(reply);
        }        
    });         
}   


function testResponse(response) {
    let data = {value: "Its Working."};
    let reply = JSON.stringify(data);
    response.end(reply);
} 

function welcome(response) {
    let data = {"value" : "Welcome to the Energy-Squirrel Api !"};    
    let reply = JSON.stringify(data);    
    response.end(reply);
}
                        




                         //TESTING 
function save(data) {
    data.save((err)=>{
        if(err) {
            return "failure";
        } else {
            return "success";
        }
    })
}

function sendStatus(response){
    response.write(JSON.stringify({status : status}));
    response.end();
}
