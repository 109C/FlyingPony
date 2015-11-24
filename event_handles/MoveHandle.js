module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    Entity.teleportTo(Event.getPosition())
    
    Entity.getNearbyPlayers(64).forEach(function(Player){
        Player.sendEntityPosition(Entity)
    })
    
    if(Entity.isPlayer() && Event.isTeleport()){
        Entity.updateClientPosition()
    }
}