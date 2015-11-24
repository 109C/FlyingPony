var ChatEvent = require("../events/ChatEvent.js")
var EntitySpawnEvent = require("../events/EntitySpawnEvent.js")

module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    Server.Logger.log("Player '" +Player.username+ "' attempted to join.")
    
    
    Player.ueid = Server.generateUEID()
    Player.world.players[Player.username] = Player
    Server.players[Player.username] = Player
    
    Player.sendLoginInfo()
            
    Player.updateClientPosition()
    Player.sendPlayerInfos()
    Player.sendInventory()
    
    // For the player loggin in
    for(PlayerKey in Player.world.players){
        CurrentPlayer = Player.world.players[PlayerKey]
        
        // Wait for the client to react to the new player in the player list
        Server.Scheduler.addEvent(100, new EntitySpawnEvent(CurrentPlayer))
    }
    
    // For all the other players
    for(PlayerKey in Player.world.players){
        CurrentPlayer = Player.world.players[PlayerKey]
        if(CurrentPlayer === Player) continue
        
        CurrentPlayer.sendPlayerInfos()
    }
    
    var ChatMessage = new ChatEvent(undefined, undefined, {text: Player.username + " joined the game", color: "yellow"})
    Server.Scheduler.addEvent(1, ChatMessage)
    Server.Logger.log("Player '" +Player.username+ "' joined.")
}