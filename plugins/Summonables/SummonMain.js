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

var API;

function onLoad(_API){
	API = _API
    API.registerCommand("spawnable", spawnFakeEntity)
    API.registerCommand("jump", jump)
    API.registerCommand("p", printPosition)
}

function spawnFakeEntity(Command){
    if(Command.getArgs().length == 0){
        Command.getSender().tellRaw({
            text: "Usage: /spawnable [entity name]",
            color: "red"
        })
        return true
    }
    
    var EntityType = Command.getArgs()[0]
    var Sender = Command.getSender()
    var UEID = API.generateUEID()
    
    if(EntityType == "Player"){
        var FakePlayer = new FakePlayerEntity(UEID, "hithere" + Math.floor(Math.random() * 1000), Sender.world)
    	
        FakePlayer.uuid = UUID.v3({namespace: UUID.namespace.dns, name: String(Math.random())})
        API.emit(1, new LoginEvent(FakePlayer))
    
    }else if(EntityType == "Zombie"){
        API.emit(new EntitySpawnEvent(new ZombieEntity(UEID, Sender.world)))
    
    }else if(EntityType == "DroppedItem"){
        var StackToDrop = new ItemStack(new Item("iron_shovel"), 1)
        API.emit(new EntitySpawnEvent(new DroppedItemEntity(UEID, StackToDrop, Sender.world)))
    
    }else{
        Command.getSender().tellRaw({
            text: "Unable to spawn entity named '" + EntityType + "'",
            color: "red"
        })
        return true
    }
    Command.getSender().tellRaw({
        text: "Spawned the entity",
        color: "green"
    })
    return true
}

function spawnFakeZombie(Command){
    var UEID = API.generateUEID()
    API.emit(new EntitySpawnEvent(new ZombieEntity(UEID, Command.getSender().world)))
    return true
}

function spawnFakePlayer(Command){
    Command.getSender().tellRaw({
        text: "Spawned fake player"
    })
    
    var UEID = API.generateUEID()
    
    var FakePlayer = new FakePlayerEntity(UEID, "hithere" + Math.floor(Math.random() * 1000), Command.getSender().world)
    
    FakePlayer.uuid = UUID.v3({namespace: UUID.namespace.dns, name: String(Math.random())})
    
    API.emit(1, new LoginEvent(FakePlayer))
    return true
}
function jump(Command){
    var JumpHeight = Number(Command.getArgs()[0]) || 5
    API.emit(1, new MoveEvent(Command.getSender(), Command.getSender().position.add(Vec3(0, JumpHeight, 0)), true));
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