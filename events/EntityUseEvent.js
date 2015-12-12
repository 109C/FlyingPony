var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function EntityUseEvent(EntityUser, EntityUsed, MouseMode){
    Assert(typeof EntityUser == 'object', "Invalid user entity")
    Assert(typeof EntityUsed == 'object', "Invalid used entity")
    Assert(typeof MouseMode == 'number', "Invalid mouse mode")
    
    Inheritance(new Event(), this)
    
    this._user = EntityUser
    this._used = EntityUsed
    this._mouseMode = MouseMode
    this.getUser = function(){
        return this._user
    }
    this.getUsed = function(){
        return this._used
    }
    this.getMouseMode = function(){
        return this._mouseMode
    }
    this.getType = function(){
        return "EntityUseEvent"
    }
}