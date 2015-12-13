var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function PlayerDigEvent(Player, Position, Face, Status){
    Assert(typeof Player == 'object', "Invalid player)")
    Assert(typeof Position == 'object', "Invalid position")
    Assert(typeof Face == 'number', "Invalid face")
    Assert(typeof Status == 'number', "Invalid action status")
    
    Inheritance(new Event(), this)
    
    this._player = Player
    this._position = Position
    this._face = Face
    this._status = Status
    
    this.getDigger = function(){
        return this._player
    }
    this.getPosition = function(){
        return this._position
    }
    this.getFace = function(){
        return this._face
    }
    this.getStatus = function(){
        return this._status
    }
    
    this.isStart = function(){
        return this._status == 0
    }
    this.isAbort = function(){
        return this._status == 1
    }
    this.isFinish = function(){
        return this._status == 2
    }
    this.getType = function(){
        return "PlayerDigEvent"
    }
}