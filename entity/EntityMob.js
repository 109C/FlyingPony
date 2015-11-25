var Entity = require("./Entity.js")
var Inventory = require("../items/Inventory.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function EntityMob(UEID, World){
    Inheritance(new Entity(UEID, World), this)
    
    this.armor = new Inventory(4)
    this.heldItem = new Inventory(1)
    
    this.isMob = function(){
        return true
    }
    this.getMobId = function(){
        throw new Error("Not a mob, should be overridden by class (EntityMob.getMobId())")
    }
}