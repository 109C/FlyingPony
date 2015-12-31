//

var DefaultConfig = {
    version: "1.8"
}

var fs = require("fs")
var Inheritance = require("./util/Inheritance.js")
var Assert = require("./util/Assert.js")

var MinecraftProtocol = require("./lib/minecraft-protocol")
var MinecraftData = require("./lib/minecraft-data")(DefaultConfig.version)
var PrismarineWorld = require("./lib/prismarine-world")
var PrismarineChunk = require("./lib/prismarine-chunk")
var PrismarineWorldSync = require("./lib/prismarine-world-sync")
var Vec3 = require("./lib/vec3")
var UUID = require("./lib/uuid-1345")
var ParallelProcesses = require("./lib/parallel-processes/")

var BlockIdToBlock = {}
var BlockNameToBlock = {}

// Create block lookup table.
for(var BlockKey in MinecraftData.blocks){
    var CurrentBlock = MinecraftData.blocks[BlockKey]
    BlockIdToBlock[CurrentBlock.id] = CurrentBlock
    BlockNameToBlock[CurrentBlock.name] = CurrentBlock
}

Assert(Object.keys(BlockNameToBlock).length > 0, "Block name to block id lookup table is empty")

// Load configuration.
var Config = {}
Inheritance(DefaultConfig, Config)
try{
    Config = JSON.parse(fs.readFileSync(__dirname + "/FlyingPony.conf"))
}catch(e){
    console.log("Invalid configuration file. (FlyingPony.conf)")
    throw e;
}

Config.version = "1.8"

module.exports = {
    MinecraftProtocol: MinecraftProtocol,
    MinecraftData: MinecraftData,
    PrismarineWorld: PrismarineWorld,
    PrismarineChunk: PrismarineChunk(Config.version),
    PrismarineWorldSync: PrismarineWorldSync,
    Vec3: Vec3,
    UUID: UUID,
    ParallelProcesses: ParallelProcesses,
    internal: {
        blockIdToBlock: BlockIdToBlock,
        blockNameToBlock: BlockNameToBlock,
        Config: Config
    }
}