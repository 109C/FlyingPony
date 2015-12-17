var ChatEvent = require("../events/ChatEvent.js")
var EntitySpawnEvent = require("../events/EntitySpawnEvent.js")

module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    Server.Logger.log("Player '" +Player.username+ "' attempted to join.")
    
    
    Player.world.players[Player.username] = Player
    Player.world.entities[Player.ueid] = Player
    Server.players[Player.username] = Player
    
    Player.sendLoginInfo()
            
    Player.updateClientPosition()
    Player.sendPlayerInfos()
    Player.sendInventory()
    
    
    // For all the other players
    for(var PlayerKey in Player.world.players){
        var CurrentPlayer = Player.world.players[PlayerKey]
        if(CurrentPlayer === Player) continue
        
        CurrentPlayer.sendPlayerInfos()
    }
    
    var JoinMessage = new ChatEvent(undefined, undefined, {text: Player.username + " joined the game", color: "yellow"})
    var PlayerSpawn = new EntitySpawnEvent(Player)
    
    Server.Scheduler.addEvent(1, JoinMessage)
    Server.Scheduler.addEvent(1, PlayerSpawn)
    
    Server.Logger.log("Player '" +Player.username+ "' joined.")
}