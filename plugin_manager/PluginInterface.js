//

var fs = require("fs")
var path = require("path")

var Events = {}

var EventDirList = fs.readdirSync(path.resolve(__dirname, "../events/"))

for(Key in EventDirList){
    var EventPath = EventDirList[Key]
    if(EventPath == ".DS_Store") continue;
    
    var Event = require(path.resolve(__dirname, "../events") + "/" + EventPath)
    var InstanceOfEvent = new Event()
    Events[InstanceOfEvent.getType()] = Event
}

module.exports = function PluginInterface(Server, Plugin){
    
    this.registerCommand = function(NameCommand, Callback){
        if(!Plugin) return;
        Plugin.commands[NameCommand.toLowerCase()] = Callback
    }
    this.getEvent = function(EventName){
        if(!Plugin) return;
        return Events[EventName]
    }
    this.getPlayer = function(PlayerName){
        if(!Plugin) return;
        return Server.players[PlayerName]
    }
    this.generateUEID = function(){
        if(!Plugin) return;
        return Server.generateUEID()
    }
    this.on = function(EventName, Callback){
        if(!Plugin) return;
        Plugin.listeners[EventName.toLowerCase()] = Callback
    }
    this.emit = function(TicksFromNow, Event){
        if(!Plugin) return;
        if(Event == undefined){
            Event = TicksFromNow
            Server.Scheduler.addEvent(1, Event)
        }else{
            Server.Scheduler.addEvent(TicksFromNow, Event)
        }
    }
}