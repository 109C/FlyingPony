//

var Library = require("../../Library.js")
var Vec3 = Library.Vec3
var UUID = Library.UUID

var FakePlayerEntity = require("./FakePlayerEntity.js")
var ZombieEntity = require("../../entity/ZombieEntity.js")
var DroppedItemEntity = require("../../entity/DroppedItemEntity.js")
var ItemStack = require("../../items/ItemStack.js")
var Item = require("../../items/Item.js")

var MoveEvent = require("../../events/MoveEvent.js")
var LoginEvent = require("../../events/LoginEvent.js")
var EntitySpawnEvent = require("../../events/EntitySpawnEvent.js")

module.exports = onLoad

function onLoad(){
    this.registerCommand("summonable", spawnFakeEntity)
    this.registerCommand("jump", jump)
    this.registerCommand("p", printPosition)
}

function spawnFakeEntity(Command){
    if(Command.getArgs().length == 0){
        Command.hasSender() && Command.getSender().tellRaw({
            text: "Usage: /summonable [entity name]",
            color: "red"
        })
        return true
    }
    
    var EntityType = Command.getArgs()[0]
    var Sender = Command.getSender()
    var UEID = this.generateUEID()
    
    if(EntityType == "Player"){
        var FakePlayer = new FakePlayerEntity(UEID, "hithere" + Math.floor(Math.random() * 1000), Sender.world)
    	
        FakePlayer.uuid = UUID.v3({namespace: UUID.namespace.dns, name: String(Math.random())})
        this.emit(1, new LoginEvent(FakePlayer))
    
    }else if(EntityType == "Zombie"){
        var NewZombie = new ZombieEntity(UEID, Sender.world)
        NewZombie.tick()
        this.emit(new EntitySpawnEvent(NewZombie))
    
    }else if(EntityType == "DroppedItem"){
        var StackToDrop = new ItemStack("iron_shovel", 1)
        this.emit(new EntitySpawnEvent(new DroppedItemEntity(UEID, StackToDrop, Sender.world)))
    
    }else{
        Command.hasSender() && Command.getSender().tellRaw({
            text: "Unable to spawn entity named '" + EntityType + "'",
            color: "red"
        })
        return true
    }
    Command.hasSender() && Command.getSender().tellRaw({
        text: "Spawned the entity",
        color: "green"
    })
    return true
}

function jump(Command){
    var JumpHeight = Number(Command.getArgs()[0]) || 5
    this.emit(1, new MoveEvent(Command.getSender(), Command.getSender().position.add(Vec3(0, JumpHeight, 0)), true));
    return true
}

function printPosition(Command){
	var S = Command.getSender()
	
	var PositionAndRotation = "X: " + Math.floor(S.position.x) + " Y: " + Math.floor(S.position.y) + " Z: " + Math.floor(S.position.z) +
	                          " Pitch:" + Math.floor(S.pitch) + " Yaw: " + Math.floor(S.yaw)
	
    S.tellRaw({
        text: PositionAndRotation
    })
    return true
}