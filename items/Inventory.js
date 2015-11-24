var Assert = require("../util/Assert.js")

var ItemStack = require("./ItemStack.js")
var Item = require("./Item.js")

module.exports = function Inventory(Slots){
    Assert(typeof Slots == 'number', "The number of slots must be a number")
    
    this._inventory = new Array(Slots)
    this.slotAmount = Slots
    
    this.getSlot = function(SlotIndex){
        return this._inventory[SlotIndex]
    }
    this.setSlot = function(SlotIndex, Item){
        this._inventory[SlotIndex] = Item
    }
    
    for(var i = 0; i < Slots; i++){
        this._inventory[i] = new ItemStack(new Item(256), 1)
    }
}