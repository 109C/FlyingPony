module.exports = function(Server, Event){
    var Entity = Event.getEntity()
    
    Entity.world.entities[Entity.ueid] = Entity
}