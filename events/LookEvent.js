var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function MoveEvent(Entity, Pitch, Yaw, IsTeleport){
    Inheritance(new Event(), this)
    
    this._entity = Entity
    this._pitch = Pitch
    this._yaw = Yaw
    this._isTeleport = IsTeleport
    
    this.getEntity = function(){
        return this._entity
    }
    this.getPitch = function(){
        return this._pitch
    }
    this.getYaw = function(){
        return this._yaw
    }
    this.isTeleport = function(){
        return this._isTeleport
    }
    this.getType = function(){
        return "LookEvent"
    }
}