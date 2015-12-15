//

var MinecraftData = require("../Library.js").MinecraftData
var Assert = require("../util/Assert.js")

var IdToItem = {}
var NameToItem = {}

// Add items.json
for(ItemPlace in MinecraftData.items){
    var CurrentItem = MinecraftData.items[ItemPlace]
    
    IdToItem[Number(CurrentItem.id)] = CurrentItem
    NameToItem[CurrentItem.name] = CurrentItem
}

// Add blocks.json
for(ItemPlace in MinecraftData.blocks){
    var CurrentItem = MinecraftData.blocks[ItemPlace]
    
    IdToItem[Number(CurrentItem.id)] = CurrentItem
    NameToItem[CurrentItem.name] = CurrentItem
}

module.exports = function Item(ItemIdOrName){
    Assert(typeof ItemIdOrName == 'number' || typeof ItemIdOrName == 'string', "Invalid item identifier")
    Assert(typeof IdToItem[ItemIdOrName] == 'object' || typeof NameToItem[ItemIdOrName] == 'object', "Invalid item indentifier, not in minecraft data")
    
    var ItemInfo = IdToItem[ItemIdOrName] ? IdToItem[ItemIdOrName] : NameToItem[ItemIdOrName]
    
    return ItemInfo
}