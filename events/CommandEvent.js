var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function IncomingCommandeEvent(SourcePlayer, Command, Args){
    Inheritance(new Event(), this)
    
    this._SourcePlayer = SourcePlayer
    this._Command = Command
    this._Args = Args
    
    this.hasSender = function(){
        return this._SourcePlayer ? true : false
    }
    this.getSender = function(){
        return this._SourcePlayer
    }
    this.getCommand = function(){
        return this._Command
    }
    this.getArgs = function(){
        return this._Args
    }
    this.getType = function(){
        return "CommandEvent"
    }
}