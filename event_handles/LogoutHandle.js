var ChatEvent = require("../events/ChatEvent.js")

module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    Player.Client.end()
    
    delete Server.players[Player.username]
    delete Player.world.players[Player.username]
    delete Player.world.entities[Player.ueid]
    
    Server.Logger.log("Player '" +Player.username+ "' left.")
    var ChatMessage = new ChatEvent(undefined, undefined, Player.username + " left the game")
    Server.Scheduler.addEvent(1, ChatMessage)
}