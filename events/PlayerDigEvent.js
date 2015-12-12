var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function PlayerDigEvent(Entity, Position, Face, Status){
    Assert(typeof Entity == 'object', "Invalid entity (Wrong type)")
    Assert(typeof Position == 'object', "Invalid position (Wrong type)")
    Assert(typeof Face == 'number', "Invalid face (Wrong type)")
    Assert(typeof Status == 'number', "Invalid action status (Wrong type)")
    
    Inheritance(new Event(), this)
    
    this._entity = Entity
    this._position = Position
    this._face = Face
    this._status = Status
    
    this.getEntity = function(){
        return this._entity
    }
    this.getPosition = function(){
        return this._position
    }
    this.getFace = function(){
        return this._face
    }
    this.getStatus = function(){
        return this._status
    }
    
    this.isStart = function(){
        return this._status == 0
    }
    this.isAbort = function(){
        return this._status == 1
    }
    this.isFinish = function(){
        return this._status == 2
    }
    this.getType = function(){
        return "PlayerDigEvent"
    }
}