var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function MoveEvent(Entity, Position, IsTeleport){
    Inheritance(new Event(), this)
    
    this._entity = Entity
    this._position = Position
    this._isTeleport = IsTeleport
    
    this.getEntity = function(){
        return this._entity
    }
    this.getPosition = function(){
        return this._position
    }
    this.isTeleport = function(){
        return this._isTeleport
    }
    this.getType = function(){
        return "MoveEvent"
    }
}