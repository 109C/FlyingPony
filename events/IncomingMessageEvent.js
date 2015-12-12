var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function IncomingMessageEvent(SourcePlayer, Message){
    Assert(typeof SourcePlayer == 'object' || typeof SourcePlayer == undefined, "Invalid player (Should be player or undefined)")
    Assert(typeof Message == 'string', "Invalid message")
    
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