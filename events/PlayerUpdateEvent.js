var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function PlayerUpdateEvent(Player){
    Inheritance(new Event(), this)
    
    this._player = Player
    this.getPlayer = function(){
        return this._player
    }
    this.getType = function(){
        return "PlayerUpdateEvent"
    }
}