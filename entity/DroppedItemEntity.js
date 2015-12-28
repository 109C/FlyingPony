var Entity = require("./Entity.js")
var Inventory = require("../items/Inventory.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function DroppedItem(UEID, Item, World){
    Inheritance(new Entity(UEID, World), this)
    
    this.contents = new Inventory(1)
    this.contents.setSlot(0, Item)
    
    
    // No clue why these values work
    this.metadataKey = 10
    this.metadataType = 5
    
    this.isObject = function(){
        return true
    }
    this.getObjectId = function(){
        return 2
    }
    this.hasMetadataPacket = function(){
        return true
    }
    this.getPhysicalWidth = function(){
        return 0.25
    }
    this.getPhysicalHeight = function(){
        return 0.25
    }
    this.getMetadataPacket = function(){
        return [{
            key: this.metadataKey,
            type: this.metadataType,
            value: this.contents.getSlot(0).toNotch()
        }]
    }
}