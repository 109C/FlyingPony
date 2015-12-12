var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function LogoutEvent(Player){
    Assert(typeof Player == 'object', "Invalid player")
    
    Inheritance(new Event(), this)
    
    this._Player = Player
    this.getPlayer = function(){
        return this._Player
    }
    this.getType = function(){
        return "LogoutEvent"
    }
}