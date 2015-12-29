var util = require("util")

var ChatEvent = require("../events/ChatEvent")
var LoginEvent = require("../events/LoginEvent")

module.exports = function(Server, Event){
    if(Event.hasSender()){
    	var Sender = Event.getSender()
    	if(Event.getCommand().toLowerCase() == "core"){
            var Args = Event.getArgs()
            if(Args[0] == "list"){
                Server.Scheduler.addEvent(1, new ChatEvent(undefined, Event.getSender(), {"text": "List of all plugins active:", color: "dark_green"}))
                for(PluginKey in Server.PluginManager.plugins)
                    Server.Scheduler.addEvent(1, new ChatEvent(undefined, Event.getSender(), {"text": JSON.stringify(PluginKey), color:"green"}))
            }else if(Args[0] == "disable"){
                Server.PluginManager.disablePlugin(Args[1])
                Server.Scheduler.addEvent(1, new ChatEvent(undefined, Event.getSender(), {"text": "Disabling plugin '" + Args[1] + "'", color:"green"}))
            }else if(Args[0] == "entities"){
                Server.Scheduler.addEvent(1, new ChatEvent(undefined, Event.getSender(), {"text": "SpawnedEntities '" + Object.keys(Sender.spawnedEntities) + "'", color:"green"}))
            }
        }else{
            Server.Scheduler.addEvent(1, new ChatEvent(undefined, Sender, {"text": "No such command.", "color": "red"}))
        }
    }else{
        // The sender has no existence
    }
}