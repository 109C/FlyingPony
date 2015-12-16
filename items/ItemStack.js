var Assert = require("../util/Assert.js")
var Item = require("./Item.js")

module.exports = function ItemStack(ItemType, StackSize){
    Assert(typeof ItemType == 'object' || typeof ItemType == 'string', "ItemType must be a prismarine block or item id / name")
    Assert(typeof StackSize == 'number', "StackSize has to be a number")
    
    this.itemType = typeof ItemType == 'object' ? ItemType : Item(ItemType)
    this.stackSize = StackSize
    
    this.isEmpty = function(){
        return this.stackSize == 0 ? true : false
    }
    this.toNotch = function(){
        if(this.isEmpty()){
            return {
                blockId: -1
            }
        }else{
            return {
                blockId: this.itemType.id,
                itemCount: this.stackSize,
                itemDamage: 0
            }
        }
    }
    
    this.take = function(NewStackSize){
        if(NewStackSize >= this.stackSize){
            var NewStack = new ItemStack(this.itemType, this.stackSize)
            this.stackSize = 0
            return NewStack
        }else{
            var NewStack = new ItemStack(this.itemType, NewStackSize)
            this.stackSize -= NewStackSize
            return NewStack
        }
    }
}