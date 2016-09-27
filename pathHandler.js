// This module contains all objects and helper functions related to handling resource requests

"use strict";

var http = require('http');
var url = require('url');

/**
 * @desc The handler object is responsible for monitoring the requests to the server
 *       calling the appropriate callback for any matching path and method
 * @constructor {Handler} name
 * @param {Http.Server} server The server to watch for resource requests
 * @returns {Handler}
 */
var Handler = function Handler(server) {
    //if the function was called without prefixing the 'new' keyword
    //call again with 'new' and return the result
    if(! new.target) {
        return new Handler(server);
    }
    
    this.routes = {};  //contains the callbacks for handled paths   
    
    //serve response whenever a user requests a resource    
    server.on('request', (request, response) => {
        //just some logging information
        console.log(`${request.method} Request made to ${request.url} @@ ${new Date(Date.now()).toUTCString()}`);
        
        //'true' parses the query string into an object
        let urlobj = url.parse(request.url, true);
        let path = urlobj.pathname;
        let method = request.method;
        
        //find the callback that matches the url and method                
        let callback = this.getCallback(path, method, this.routes);
        
        //obtain additional info sent , if any
        let data = "";
        request.on('data', (chunk) =>{
            data += chunk.toString();            
        });
        request.on('end', ()=>{
            response.writeHead(200, {"Content-Type" : "text/json"});                       
            callback(response, data);    
        });                
    });
    return this;
};

// SIDE_NOTE :: once a function is defined on a Handler object the path/method combination is said to be 'handled'
Handler.prototype.addHandle = function addPath(path, method, callback) {    
    var pathObj = this.routes[path];
    if(pathObj && pathObj[method]) {
        console.error("Cannot rebind path, use overridePath method");
    } else if(pathObj && !(pathObj[method])) {
        this.routes[path][method] = callback;
    } else {
        this.routes[path] = {};
        this.routes[path][method] = callback;
    }
};

//TODO: override path method


/**
 * @desc returns a resoure not found message for invalid routes
 * @private 
 * @returns a json string containing resource not found message
 */
function resourceNotFoundResponse(response) {
    let data = {value : "Resource not found"};
    let reply = JSON.stringify(data);
    response.writeHead(200, {"Content-Type" : "text/json"});
    response.end(reply);
}

Handler.prototype.getCallback = function getCallback(rpath, method, routes) {    
    for(let hpath in routes) {        
        if(isMatch(rpath, hpath) && ( typeof routes[hpath][method] === 'function')) {            
            return routes[hpath][method];
        }
    }       
    
    return resourceNotFoundResponse;
}

/**
 * @private
 * @desc This function accpets two url paths and absolves the symbols in the paths to
 * determine whether the requested path matches a path defined on a handled path
 * @param {string} pathA 
 * @param {string} pathB 
 * @returns {bool} returns whether pathA is a valid match for path B
 */
function isMatch(rPath, hPath) {
    //create arrays containing the components of the paths
    //example : "/user/:id/books/" will decompose to ['user', ':id', 'books']
    var requestPathComponents = rPath.split("/");    
    var handlerPathComponents = hPath.split("/");
        
    //if the length of the components dont match then the paths cannot match
    if(handlerPathComponents.length !== requestPathComponents.length) {        
        return false;        
    }
    
    //iterate over both paths comparing elements     
    for(let i = 0; i < handlerPathComponents.length; i += 1) {         
        //no two place holders should match
        // side-note :: placeholders are path components that begin with a ':'
        if(handlerPathComponents[i].startsWith(":") && requestPathComponents[i].startsWith(":")){
            return false;
        // if the components are not placeholders they should match
        } else if (handlerPathComponents[i] !== requestPathComponents[i]) {                        
            return false;            
        }       
    }    
    
    return true;
}

module.exports.Handler          = Handler;
module.exports.RNFResponse      = resourceNotFoundResponse;