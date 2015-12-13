//


var LoginEventHandle = require("../event_handles/LoginHandle.js")
var PlayerUpdateHandle = require("../event_handles/PlayerUpdateHandle.js")
var LogoutHandle = require("../event_handles/LogoutHandle.js")
var ChatHandle = require("../event_handles/ChatHandle.js")
var CommandHandle = require("../event_handles/CommandHandle.js")
var IncomingMessageHandle = require("../event_handles/IncomingMessageHandle.js")
var EntitySpawnHandle = require("../event_handles/EntitySpawnHandle.js")
var MoveHandle = require("../event_handles/MoveHandle.js")
var LookHandle = require("../event_handles/LookHandle.js")
var EntityUseHandle = require("../event_handles/EntityUseHandle.js")
var PlayerDigHandle = require("../event_handles/PlayerDigHandle.js")

var PlayerUpdateEvent = require("../events/PlayerUpdateEvent.js")

module.exports = function(Server){
    
    // Add all the players to be ticked.
    for(var CurrentPlayer in Server.players){
        Server.Scheduler.addEvent(1, new PlayerUpdateEvent(Server.players[CurrentPlayer]))
    }
    
    // Add all the entities, in all the worlds that are not players to be ticked.
    for(var WorldKey in Server.worlds){
        var World = Server.worlds[WorldKey]
        for(var EntityKey in World.entities){
            var Entity = World.entities[EntityKey]
            
            Entity.tick().forEach(function(Event){
                Server.Scheduler.addEvent(1, Event)
            })
            
        }
    }
    
    
    // Handles events since last tick
    var Events = Server.Scheduler.getEvents()
    
    // Let the plugins have first pick, and remove the event if it's canceled
    for(var EventIndex in Events){
        var Event = Events[EventIndex]
        
        if(Server.PluginManager.triggerEvent(Server, Event)){
            Events.splice(Events.indexOf(Event), 1)
        }
    }
    
    for(var EventIndex in Events){
        var Event = Events[EventIndex]
        var EventType = Event.getType()
        
        if( EventType == "LoginEvent"){
            LoginEventHandle(Server, Event)
            
        }else if(EventType == "PlayerUpdateEvent"){
            PlayerUpdateHandle(Server, Event)
            
        }else if(EventType == "LogoutEvent"){
            LogoutHandle(Server, Event)
            
        }else if(EventType == "IncomingMessageEvent"){
            IncomingMessageHandle(Server, Event)
            
        }else if(EventType == "ChatEvent"){
            ChatHandle(Server, Event)
            
        }else if(EventType == "CommandEvent"){
            CommandHandle(Server, Event)
            
        }else if(EventType == "EntitySpawnEvent"){
            EntitySpawnHandle(Server, Event)
            
        }else if(EventType == "MoveEvent"){
            MoveHandle(Server, Event)
            
        }else if(EventType == "EntitySpawnEvent"){
            EntitySpawnHandle(Server, Event)
            
        }else if(EventType == "LookEvent"){
            LookHandle(Server, Event)
            
        }else if(EventType == "EntityUseEvent"){
            EntityUseHandle(Server, Event)
            
        }else if(EventType == "PlayerDigEvent"){
            PlayerDigHandle(Server, Event)
        }
    }
    
    // Go to the next tick.
    Server.Scheduler.tick()
}