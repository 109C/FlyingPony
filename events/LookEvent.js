var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function LookEvent(Entity, Pitch, Yaw, IsTeleport){
    Assert(typeof Entity == 'object', "Invalid entity")
    Assert(typeof Pitch == 'number', "Invalid pitch")
    Assert(typeof Yaw == 'number', "Invalid pitch")
    Assert(typeof IsTeleport == 'boolean', "Invalid teleport status")
    
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