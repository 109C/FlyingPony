var Library = require("../Library.js")

var Vec3 = Library.Vec3
var UUID = Library.UUID
var Assert = require("../util/Assert.js")

module.exports = function Entity(UEID, World){
    Assert(typeof UEID == 'number', "UEID must be a number")
    Assert(typeof World == 'object', "The world must be an object or instance of World")
    Assert(typeof World.players == 'object', "The world's player map must be an object")
    Assert(typeof World.PrismarineWorld == 'object', "The world's prismarine world must be an object or instance of PrismarineWorld")
    
    this.position = new Vec3(0, 16, 0)
    this.uuid = "0-0-0-0-0"
    this.ueid = UEID
    this.yaw = 0
    this.pitch = 0
    this.world = World
    this.rawWorld = World.PrismarineWorld
    
    this.tick = function(){
        return;
    }
    this.isPlayer = function(){
        return false
    }
    this.isMob = function(){
        return false
    }
    this.isObject = function(){
        return false
    }
    this.hasMetadataPacket = function(){
        return false
    }
    this.isGravitational = function(){
        return false
    }
    this.getPhysicalWidth = function(){
        return 1
    }
    this.getPhysicalHeight = function(){
        return 1
    }
    this.moveRelative = function(RelativeVector){
        this.position.add(RelativeVector)
    }
    this.teleportTo = function(Vector){
        this.position = Vector
    }
    
    this.changeWorld = function(NewWorld){
        
    }
    this.doGravity = function(){
        
    }
    this.getDistanceFrom = function(Entity){
        return this.position.distanceTo(Entity.position)
    }
    this.getNearbyEntities = function(MaxDistance){
        var NearEntities = []
        for(EntityKey in this.world.entities){
            var Entity = this.world.entities[EntityKey]
            
            if(this.getDistanceFrom(CurrentEntity) <= MaxDistance && this != CurrentEntity){
                NearPlayers.push(CurrentEntity)
            }
        }
        return NearEntities
    }
    this.getNearbyPlayers = function(MaxDistance){
    	var NearPlayers = []
        for(PlayerKey in this.world.players){
            var CurrentPlayer = this.world.players[PlayerKey]
            
            if(this.getDistanceFrom(CurrentPlayer) <= MaxDistance && this != CurrentPlayer){
                NearPlayers.push(CurrentPlayer)
            }
        }
        return NearPlayers
    }
}