var Library = require("../Library.js")
var Inheritance = require("../util/Inheritance.js")

var Vec3 = Library.Vec3
var UUID = Library.UUID
var Assert = require("../util/Assert.js")
var Intersects = require("../util/Intersects.js")
var Physics = require("../util/Physics.js")
var MoveEvent = require("../events/MoveEvent.js")

module.exports = function Entity(UEID, World){
    Assert(typeof UEID == 'number', "UEID must be a number")
    Assert(typeof World == 'object', "The world must be an object or instance of World")
    Assert(typeof World.players == 'object', "The world's player map must be an object")
    Assert(typeof World.PrismarineWorld == 'object', "The world's prismarine world must be an object or instance of PrismarineWorld")
    
    Inheritance({}, this)
    
    this.position = new Vec3(0, 16, 0)
    this.velocity = new Vec3(0, 0, 0)
    this.terminalVelocity = 4
    this.gravityVelocity = 0.08
    this.uuid = "0-0-0-0-0"
    this.ueid = UEID
    this.yaw = 0
    this.pitch = 0
    this.world = World
    this.rawWorld = World.PrismarineWorld
    
    this.nearbyEntities = []
    this.nearbyPlayers = []
    this.nearbyRange = 64
    
    this.tick = function(){
        var TickEvents = []
        var Event;
        
        if(Event = this.doAI()) TickEvents.push(Event);
        if(this.isGravitational()) this.doGravity();
        if(this.isGravitational() && (Event = this.doPhysics())) TickEvents.push(Event);
        
        return TickEvents
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
    this.changeWorld = function(NewWorld){}
    
    this.doGravity = function(){
        var BlocksBelow = []
        for(var i = -Math.ceil(this.getPhysicalWidth()); i < Math.ceil(this.getPhysicalWidth()); i++){
            for(var j = -Math.ceil(this.getPhysicalWidth()); j < Math.ceil(this.getPhysicalWidth()); j++){
                var BlockBelow = this.rawWorld.getBlock(new Vec3(i, Math.floor(this.position.y), j))
                BlockBelow.position = new Vec3(i, Math.floor(this.position.y), j)
                BlocksBelow.push(BlockBelow)
            }
        }
        for(var BlockKey in BlocksBelow){
            var Block = BlocksBelow[BlockKey]
            var DoesIntersect = Intersects({
                x1: Block.position.x,
                y1: Block.position.z,
                x2: Block.position.x + 1,
                y2: Block.position.z + 1
            },{
                x1: this.position.x - this.getPhysicalWidth() / 2,
                y1: this.position.z - this.getPhysicalWidth() / 2,
                x2: this.position.x + this.getPhysicalWidth() / 2,
                y2: this.position.z + this.getPhysicalWidth() / 2,
            })
            if(Block.boundingBox != "empty" && DoesIntersect){
                this.velocity.y = 0
                return;
            }
        }
        this.velocity.y -= this.gravityVelocity
    }
    this.doPhysics = function(){
        Physics.calculateDrag(this.velocity)
        
        var ZeroVector = new Vec3(0, 0, 0)
        var VelocityLength = this.velocity.distanceTo(ZeroVector)
        
        // If we're going faster than we can, slow down.
        if(VelocityLength > this.terminalVelocity){
            var Scalar = this.terminalVelocity / VelocityLength
            this.velocity.scaled(Scalar)
        }
        return new MoveEvent(this, this.position.add(this.velocity), false)
    }
    this.doAI = function(){}
    
    this.getDistanceFrom = function(Entity){
        return this.position.distanceTo(Entity.position)
    }
    this.calculateNearbyEntities = function(MaxDistance){
        this.neabyRange = MaxDistance || this.nearbyRange
        this.nearbyEntities = {}
        this.nearbyPlayers = {}
        
        for(EntityKey in this.world.entities){
            var CurrentEntity = this.world.entities[EntityKey]
            
            if(this.getDistanceFrom(CurrentEntity) <= this.nearbyRange && this != CurrentEntity){
                this.nearbyEntities[CurrentEntity.ueid] = CurrentEntity
                if(CurrentEntity.isPlayer()){
                    this.nearbyPlayers[CurrentEntity.username] = CurrentEntity
                }
            }
        }
    }
}