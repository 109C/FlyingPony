var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function ChatEvent(SenderPlayer, DestinationPlayer, Message){
    Assert(typeof SenderPlayer == 'object' || SenderPlayer == undefined, "Invalid sender (Should be player or undefined)")
    Assert(typeof DestinationPlayer == 'object' || DestinationPlayer == undefined, "Invalid destination (Should be player or undefined)")
    Assert(typeof Message == 'string' || typeof Message == 'object', "Invalid message")
    
    Inheritance(new Event(), this)
    
    this._Sender = SenderPlayer
    this._Reciever = DestinationPlayer
    this._Message = Message
    
    this.hasReciever = function(){
        return this._Reciever ? true : false
    }
    this.hasSender = function(){
        return this._Sender ? true : false
    }
    
    this.getReciever = function(){
        return this._Reciever
    }
    this.getSender = function(){
        return this._Sender
    }
    this.getMessage = function(){
        return this._Message
    }
    this.getType = function(){
        return "ChatEvent"
    }
}