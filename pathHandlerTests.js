"use strict";

var handler = require('../src/pathHandler');

var mocha = require('mocha');
var sinon = require('sinon');
var chai  = require('chai');
 
describe('Path Handler', function(){
    describe('Path Handler Constructor', function(){
        it("should return an object when called without 'new' prefix", function(){
           chai.assert.isObject(handler.Handler()); 
        });
        it("should return an object when called with 'new' prefix", function(){
            chai.assert.isObject(new handler.Handler());
        });
    });
    
    describe('Match Path Function', function(){
       it('should match any symbol to a placeholder', function(){
          chai.assert.isTrue(handler.match("users/22/name", "users/:uid/name"));
          chai.assert.isTrue(handler.match("boats/**9642/[]p][]", "users/:id/:garbage")); 
       });
       it('should not match two placeholders', function(){
          chai.assert.isFalse(handler.match("home/:uname", "/home/:uname"));
          chai.assert.isFalse(handler.match("home/:uname", "/home/:ublame"));
       });
       it('should match equivalent paths that contain no placeholders', function(){
           chai.assert.isTrue(handler.match("/home/laundry", "/home/laundry"));
           chai.assert.isTrue(handler.match("/home/cups", "/home/cups"));
       })
       it('should not match paths with an unequal number of components', function(){
           chai.assert.isFalse(handler.match("home/:uname/lol", "home/:uname"));
           chai.assert.isFalse(handler.match("home/:uname", "home/:uname/hey"));
       })
    });
    
    describe('Get Callback Function', function(){
        it('should work', function(){
            let routes = {
                "home/users" : {
                    "GET" : function(){}
                }
            };
            chai.assert.isFunction(handler.getCallback("home/users", "GET", routes));  
        });
    });
});

