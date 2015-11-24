var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function IncomingMessageEvent(SourcePlayer, Message){
    Inheritance(new Event(), this)
    
    this._SourcePlayer = SourcePlayer
    this._Message = Message
    
    this.isAnonymous = function(){
        return this._SourcePlayer ? true : false
    }
    this.getPlayer = function(){
        return this._SourcePlayer
    }
    this.getMessage = function(){
        return this._Message
    }
    this.getType = function(){
        return "IncomingMessageEvent"
    }
}