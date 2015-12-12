var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function EntitySpawnEvent(Entity){
    Assert(typeof Entity == 'object', "Invalid entity")
    
    Inheritance(new Event(), this)
    
    this._entity = Entity
    
    this.getEntity = function(){
        return this._entity
    }
    this.getType = function(){
        return "EntitySpawnEvent"
    }
}