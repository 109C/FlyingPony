//


var Library = require("../Library.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")
var Convert = require("../util/Convert.js")
var Validate = require("../util/Validate.js")

var Entity = require("./Entity.js")
var DroppedItemEntity = require("./DroppedItemEntity.js")
var ItemStack = require("../items/ItemStack.js")
var Item = require("../items/Item.js")
var Inventory = require("../items/Inventory.js")

var PlayerDigEvent = require("../events/PlayerDigEvent.js")
var LogoutEvent = require("../events/LogoutEvent.js")
var EntitySpawnEvent = require("../events/EntitySpawnEvent.js")

module.exports = function Player(UEID, Client, World){
    Assert(typeof Client == 'object', "Client must be an object or instance of NMP client")
    Assert(typeof Client.username == 'string', "Client's username must be a string")
    Assert(typeof Client.write == 'function', "Client must implement a write method")
    
    Inheritance(new Entity(UEID, World), this)
    
    _self = this
    this.Client = Client
    this.username = Client.username
    this.uuid = Client.uuid
    this.sentChunks = {}
    this.spawnedEntities = {}
    this.loadingChunks = true
    
    this.heldSlot = 0
    this.inventory = new Inventory(36)
    this.craftingArea = new Inventory(4)
    this.craftingOutput = new Inventory(1)
    this.diggingBlock = null
    this.diggingBlockFace = null
    this.diggingTimeLeft = null
    this.gamemode = 0
    
    this.isPlayer = function(){
        return true
    }
    this.isGravitational = function(){
        return false
    }
    this.isDigging = function(){
        return this.diggingBlock == undefined ? false : true
    }
    
    this.resetDigging = function(){
        this.diggingBlock = null
        this.diggingBlockFace = null
        this.diggingTimeLeft = null
    }
    this.startDigging = function(Position, Face){
        Assert(Validate.isVec3(Position), "Invalid position for block dig")
        
        // In case we where digging a block before
        this.resetDigging()
        
        this.diggingBlock = Position
        this.diggingBlockFace = Face
        var DiggingBlock = this.world.getBlock(Position)
        
        // Check if we can dig at all
        if(this.gamemode == 2 || this.gamemode == 3){
            this.resetDigging()
            return;
        }
        
        this.diggingTimeLeft = DiggingBlock.digTime(this.inventory.getSlot(this.heldSlot), this.gamemode == 1, false, false) / 1000
    }
    this.finishDigging = function(Position){
        Assert(Validate.isVec3(Position), "Invalid position for block dig")
        
    }
    
    this.changeGamemode = function(NewGamemode){
        switch(NewGamemode){
            case "survival":
            case 0:
                this.gamemode = 0
            break;
            case "creative":
            case 1:
                this.gamemode = 1
            break;
            case "adventure":
            case 2:
                this.gamemode = 2
            break;
            case "spectator":
            case 3:
                this.gamemode = 3
            break;
            default:
                throw new Error("Invalid gamemode type / number")
        }
        this.resetDigging()
        this.sendGamemode()
    }
    var ParentTick = this.tick
    this.tick = function(){
        var Events = ParentTick.apply(this, [])
        
        // Decrease digging time left
        if(this.diggingTimeLeft != null && this.diggingTimeLeft > 0){
            this.diggingTimeLeft -= 0.05
            if(this.diggingTimeLeft < 0) this.diggingTimeLeft = 0;
        }
        // Break the block if the digging time is up.
        if(this.diggingTimeLeft != null && this.diggingTimeLeft < 0.05){
            if(this.gamemode == 0){
                var BrokenStack = new ItemStack({id:this.world.getBlock(this.diggingBlock).type}, 1)
                var DroppedStack = new DroppedItemEntity(this.world.generateUEID(), BrokenStack, this.world)
                
                DroppedStack.teleportTo(this.diggingBlock)
                Events.push(new EntitySpawnEvent(DroppedStack))
            }
            this.world.setBlock(this.diggingBlock, "air", 0)
            this.resetDigging()
        }
        return Events;
    }
    
    this.hasSpawnedEntity = function(Entity){
        if(this.spawnedEntities[Entity.ueid] == undefined){
            return false
        }else{
            return true
        }
    }
    
    this.sendInventory = function(){
        for(var slot = 0; slot < 4 * 9; slot++){
            this.Client.write('set_slot', {
                windowId: 0,
                slot: slot + 9,
                item: this.inventory.getSlot(slot).toNotch()
            })
        }
    }
    this.sendPlayerInfos = function(){
    	var PlayerInfos = []
        for(var CurrentPlayerKey in this.world.players){
            var CurrentPlayer = this.world.players[CurrentPlayerKey]
            
            this.Client.write('player_info', {
        	    action: 0,
                data: [
                    {
                        UUID: CurrentPlayer.uuid,
                        name: CurrentPlayer.username,
                        properties: [],
                        gamemode: 0,
                        ping: 1
                    }
                ]
            })
        }
    }
    this.sendEntitySpawn = function(Entity){
        this.spawnedEntities[Entity.ueid] = true
        if(Entity.isPlayer()){
            this.Client.write('named_entity_spawn', {
                entityId: Entity.ueid,
                playerUUID: Entity.uuid,
                x: Entity.position.x * 32,
                y: Entity.position.y * 32,
                z: Entity.position.z * 32,
                yaw: Convert.Convert360To256(Entity.yaw),
                pitch: Convert.Convert360To256(Entity.pitch),
                currentItem: 0,
                metadata: []
            })
        }
        if(Entity.isMob()){
            this.Client.write('spawn_entity_living', {
                entityId: Entity.ueid,
                type: Entity.getMobId(),
                x: Entity.position.x * 32,
                y: Entity.position.y * 32,
                z: Entity.position.z * 32,
                pitch: Entity.pitch,
                yaw: Convert.Convert360To256(Entity.yaw),
                pitch: Convert.Convert360To256(Entity.pitch),
                velocityX: 0,
                velocityY: 0,
                velocityZ: 0,
                metadata: []
            })
        }
        if(Entity.isObject()){
            this.Client.write('spawn_entity', {
                entityId: Entity.ueid,
                type: Entity.getObjectId(),
                x : Entity.position.x * 32,
                y : Entity.position.y * 32,
                z : Entity.position.z * 32,
                yaw: Convert.Convert360To256(Entity.yaw),
                pitch: Convert.Convert360To256(Entity.pitch),
                objectData: {
                    intField: 0,
                    velocityX: 0,
                    velocityY: 0,
                    velocityZ: 0,
                }
            })
        }
        if(Entity.hasMetadataPacket()){
            this.Client.write('entity_metadata', {
                entityId: Entity.ueid,
                metadata: Entity.getMetadataPacket()
            })
        }
    }
    this.sendEntityDespawn = function(Entity){
        delete this.spawnedEntities[Entity.ueid]
        this.Client.write('entity_destroy', {
            entityIds:[
                Entity.ueid
            ]
        })
    }
    this.sendEntityPosition = function(Entity){
        // Don't send the client info about an entity that doesn't exist.
        if(this.spawnedEntities[Entity.ueid] == undefined) return;
        
        // Objects positions are not sent to the client, it guesses where they are.
        if(Entity.isObject() == true) return;
        
        this.Client.write('entity_teleport', {
            entityId: Entity.ueid,
            x: Entity.position.x * 32,
            y: Entity.position.y * 32,
            z: Entity.position.z * 32,
            yaw: Convert.Convert360To256(Entity.yaw),
            pitch: Convert.Convert360To256(Entity.pitch),
            onGround: false
        })
        this.Client.write('entity_head_rotation', {
            entityId: Entity.ueid,
            headYaw: Convert.Convert360To256(Entity.yaw)
        })
    }
    this.sendLoginInfo = function(){
        this.Client.write('login', {
            entityId: this.Client.id,
            levelType: 'default',
            gameMode: this.gamemode,
            dimension: 0,
            difficulty: 2,
            maxPlayers: Library.internal.Config["max-players"],
        })
    }
    this.sendGamemode = function(){
        this.Client.write('game_state_change', {
            reason: 3,
            gameMode: this.gamemode
        })
    }
    this.updateClientPosition = function(){
       this.Client.write("position", {
                "x": this.position.x,
                "y": this.position.y,
                "z": this.position.z,
                "yaw": this.yaw,
                "pitch": this.pitch,
                "flags": 0x00
            }) 
    }
    this.sendChunkData = function(ChunkX, ChunkZ, ChunkDump, IsLoad){
        this.Client.write("map_chunk", {
            "x": ChunkX,
            "z": ChunkZ,
            "groundUp": true,
            "bitMap": (IsLoad ? 0xffff : 0x0000),
            "chunkData": ChunkDump
        })
    }
    this.sendBlockUpdate = function(Position, BlockID, BlockMeta){
        this.Client.write("block_change", {
            location: Position,
            type: BlockID << 4 | BlockMeta
        })
    }
    this.tellRaw = function(Message){
        this.Client.write("chat", {
            message: JSON.stringify(Message),
            position: 0
        })
    }
    this.disconnect = function(Message){
        this.Client.end(Message)
    }
}