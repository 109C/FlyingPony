module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    Entity.pitch = Event.getPitch()
    
    var Yaw256 = ((Event.getYaw() % 360) / 360) * 255
    
    if(Yaw256 > 128){
        Yaw256 -= 255
    }
    if(Yaw256 < -128){
        Yaw256 += 255
    }
    
    Entity.yaw = Math.floor(Yaw256)
    
    Entity.getNearbyPlayers(64).forEach(function(Player){
        Player.sendEntityPosition(Entity)
    })
    
    if(Entity.isPlayer() && Event.isTeleport()){
        Entity.updateClientPosition()
    }
}