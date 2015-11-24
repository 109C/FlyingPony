var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function LoginEvent(Player){
    Inheritance(new Event(), this)
    this._Player = Player
    this.getPlayer = function(){
        return this._Player
    }
    this.getType = function(){
        return "LoginEvent"
    }
}