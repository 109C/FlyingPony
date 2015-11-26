module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    Entity.pitch = Event.getPitch()
    Entity.yaw = Event.getYaw()
    
    Entity.getNearbyPlayers(64).forEach(function(Player){
        Player.sendEntityPosition(Entity)
    })
    
    if(Entity.isPlayer() && Event.isTeleport()){
        Entity.updateClientPosition()
    }
}