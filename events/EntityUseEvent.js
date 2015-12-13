var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function EntityUseEvent(EntityUser, EntityUsed, MouseMode, Position){
    if(MouseMode == 2) Assert(typeof Position == 'object', "Invalid position (Should be Vec3 or undefined)");
    Assert(typeof EntityUser == 'object', "Invalid user entity")
    Assert(typeof EntityUsed == 'object', "Invalid used entity")
    Assert(typeof MouseMode == 'number', "Invalid mouse mode")
    
    Inheritance(new Event(), this)
    
    this._user = EntityUser
    this._used = EntityUsed
    this._mouseMode = MouseMode
    this._position = Position
    
    this.getUser = function(){
        return this._user
    }
    this.getUsed = function(){
        return this._used
    }
    this.isAttack = function(){
        return this._mouseMode == 1
    }
    this.isUse = function(){
        return this._mouseMode == 0 || this._mouseMode == 2
    }
    this.isBlockUse = function(){
        return this._mouseMode == 2
    }
    this.getPosition = (MouseMode == 2)
        ? function(){
            return this._position
        }
        : function(){
            throw new Error("Cannot get position of non block use event");
        }
    
    this.getMouseMode = function(){
        return this._mouseMode
    }
    this.getType = function(){
        return "EntityUseEvent"
    }
}