module.exports = function EntitySpawnEvent(Entity){
    this._entity = Entity
    
    this.getEntity = function(){
        return this._entity
    }
    this.getType = function(){
        return "EntitySpawnEvent"
    }
}