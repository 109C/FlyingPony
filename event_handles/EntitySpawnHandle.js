module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    
    Entity.world.entities[Entity.ueid] = Entity
    
    Entity.getNearbyPlayers(64).forEach(function(Player){
        Player.sendEntitySpawn(Event.getEntity())
    })
}