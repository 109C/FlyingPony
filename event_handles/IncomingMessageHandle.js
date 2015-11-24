//

var CommandEvent = require("../events/CommandEvent.js")
var ChatEvent = require("../events/ChatEvent.js")

module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    var Message = Event.getMessage()
    if(Event.getMessage()[0] == "/"){
        var CommandParts = Message.slice(1, Message.length).split(" ")
        var PlayerCommandEvent = new CommandEvent(Player, CommandParts[0], CommandParts.slice(1, CommandParts.length))
        Server.Scheduler.addEvent(1, PlayerCommandEvent)
    }else{
        var PlayerChatEvent = new ChatEvent(Player, undefined, Message)
        Server.Scheduler.addEvent(1, PlayerChatEvent)
    }
}