var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function PlayerUpdateEvent(Player){
    Assert(typeof Player == 'object', "Invalid player")
    
    Inheritance(new Event(), this)
    
    this._player = Player
    this.getPlayer = function(){
        return this._player
    }
    this.getType = function(){
        return "PlayerUpdateEvent"
    }
}