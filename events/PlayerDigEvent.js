var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function PlayerDigEvent(Entity, Position, Status){
    Inheritance(new Event(), this)
    
    this._entity = Entity
    this._position = Position
    this._status = Status
    
    this.getEntity = function(){
        return this._entity
    }
    this.getPosition = function(){
        return this._position
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