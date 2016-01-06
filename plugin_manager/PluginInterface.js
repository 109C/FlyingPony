//

var fs = require("fs")
var path = require("path")

var Events = {}

var EventDirList = fs.readdirSync(path.resolve(__dirname, "../events/"))

for(Key in EventDirList){
    var EventPath = EventDirList[Key]
    if(EventPath == ".DS_Store") continue;
    
    var Event = require(path.resolve(__dirname, "../events") + "/" + EventPath)
    Events[EventPath.substr(0, EventPath.length - 3)] = Event
}

module.exports = function PluginInterface(Server, Plugin){
    
    this.registerCommand = function(NameCommand, Callback){
        if(!Plugin.enabled) return;
        Plugin.commands[NameCommand.toLowerCase()] = Callback
    }
    this.getEvent = function(EventName){
        if(!Plugin.enabled) return;
        return Events[EventName]
    }
    this.getPlayer = function(PlayerName){
        if(!Plugin.enabled) return;
        return Server.players[PlayerName]
    }
    this.generateUEID = function(){
        if(!Plugin.enabled) return;
        return Server.generateUEID()
    }
    this.on = function(EventName, Callback){
        if(!Plugin.enabled) return;
        Plugin.listeners[EventName.toLowerCase()] = Callback
    }
    this.emit = function(TicksFromNow, Event){
        if(!Plugin.enabled) return;
        if(Event == undefined){
            Event = TicksFromNow
            Server.Scheduler.addEvent(1, Event)
        }else{
            Server.Scheduler.addEvent(TicksFromNow, Event)
        }
    }
}