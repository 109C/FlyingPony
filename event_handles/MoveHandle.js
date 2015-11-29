module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    Entity.teleportTo(Event.getPosition())
    Entity.calculateNearbyEntities()
    
    for(var key in Entity.nearbyPlayers){
        var Player = Entity.nearbyPlayers[key]
        Player.sendEntityPosition(Entity)
    }
    
    if(Entity.isPlayer() && Event.isTeleport()){
        Entity.updateClientPosition()
    }
}