module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    Entity.pitch = Event.getPitch()
    Entity.yaw = Event.getYaw()
    
    Entity.calculateNearbyEntities()
    
    for(var key in Entity.nearbyPlayers){
        var Player = Entity.nearbyPlayers[key]
        Player.sendEntityPosition(Entity)
    }
    
    if(Entity.isPlayer() && Event.isTeleport()){
        Entity.updateClientPosition()
    }
}