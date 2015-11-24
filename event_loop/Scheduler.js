//

var EventProto = require("../events/Event.js")
var Assert = require("../util/Assert.js")

module.exports = function Scheduler(){
    this._tasks = {}
    this._time = 0;
    this.addEvent = function(TicksFromNow, Event){
        Assert(typeof TicksFromNow == 'number', "The amount of ticks in the future must be an integer.")
        Assert(Event.getType instanceof Function, "The event must be an event.")
        Assert(TicksFromNow > 0, "Invalid time, needs to be at least one tick in the future.")
        
        if(this._tasks[this._time + TicksFromNow] == undefined){
            this._tasks[this._time + TicksFromNow] = []
        }
        this._tasks[this._time + TicksFromNow].push(Event)
    }
    this.getEvents = function(){
        return this._tasks[this._time]
    }
    this.tick = function(){
        delete this._tasks[this._time]
        this._time++
    }
}