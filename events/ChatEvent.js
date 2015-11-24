var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function ChatEvent(SenderPlayer, DestinationPlayer, Message){
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