//

var Library = require("../Library.js")
var BlockData = Library.internal.blocks

var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")
var Convert = require("../util/Convert.js")
var Validate = require("../util/Validate.js")

var Entity = require("./Entity.js")
var Inventory = require("../items/Inventory.js")

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
    this.diggingTimeLeft = null
    
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
        this.diggingTimeLeft = null
    }
    this.startDigging = function(Position){
        Assert(Validate.isVec3(Position), "Invalid position for block dig")
        
        var DiggingBlock = this.rawWorld.getBlock(Position)
        if(DiggingBlock.diggable == true){
            this.diggingBlock = Position
        }else{
            this.resetDigging()
        }
        
        // From the minecraft wiki.
        var BaseTime = DiggingBlock.hardness * 1.5
        if(DiggingBlock.harvest && DiggingBlock.harvestTools[this.inventory.getSlot(this.heldSlot).itemType.id]) BaseTime *= 3.33;
        // Decrease dig time if the tool is enchanted.
        // Decrease dig time if the tool is a special tool.
        // Decrease dig time if we have haste.
        // Increase dig time if we have mining fatigue.
        // Increase dig time if we're underwater.
        this.diggingTimeLeft = BaseTime
    }
    this.finishDigging = function(Position){
        Assert(Validate.isVec3(Position), "Invalid position for block dig")
        if(this.diggingBlock && this.diggingBlock.equals(Position) && this.diggingTimeLeft < 1){
            // Trigger block update for all the clients
            // Spawn drop
        }else{
            this.disconnect("You broke blocks too fast!")
        }
    }
    var ParentTick = this.tick
    this.tick = function(){
        if(this.diggingTimeLeft != null && this.diggingTimeLeft > 1){
            this.diggingTimeLeft -= 0.05
            if(this.diggingTimeLeft < 0) this.diggingTimeLeft = 0;
        }
        return ParentTick.bind(this)();
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
        if(Entity.isPlayer()){
            this.Client.write('named_entity_spawn', {
                entityId: Entity.ueid,
                playerUUID: Entity.uuid,
                x: Entity.position.x * 32,
                y: Entity.position.y * 32,
                z: Entity.position.z * 32,
                yaw: Entity.yaw,
                pitch: Entity.pitch,
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
                yaw: Entity.yaw,
                headPitch: Entity.pitch,
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
                yaw: Entity.yaw,
                pitch: Entity.pitch,
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
    this.sendEntityPosition = function(Entity){
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
            gameMode: 0,
            dimension: 0,
            difficulty: 2,
            maxPlayers: 10,
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