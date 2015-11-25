var Assert = require("../util/Assert.js")

module.exports = function ItemStack(ItemType, StackSize){
    Assert(typeof ItemType == 'object', "Item has to be an object or an instance of Item")
    Assert(typeof StackSize == 'number', "StackSize has to be a number")
    
    this.itemType = ItemType
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