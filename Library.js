//

var Config = {
    version: "1.8"
}

var fs = require("fs")
var Inheritance = require("./util/Inheritance.js")
var Assert = require("./util/Assert.js")


try{
    var Deasync = require("./lib/deasync")
    var Deasyncp = require("./lib/deasyncp")
    var MinecraftProtocol = require("./lib/minecraft-protocol")
    var MinecraftData = require("./lib/minecraft-data")(Config.version)
    var PrismarineAnvil = require("./lib/prismarine-provider-anvil")
    var PrismarineChunk = require("./lib/prismarine-chunk")(Config.version)
    var PrismarineNBT = require("./lib/prismarine-nbt")
    var PrismarineWorld = require("./lib/prismarine-world")
    var PrismarineWorldSync = require("./lib/prismarine-world-sync")
    var Vec3 = require("./lib/vec3")
    var UUID = require("./lib/uuid-1345")
    var ParallelProcesses = require("./lib/parallel-processes/")
}catch(e){
    console.log("Something went wrong loading the libraries.")
    console.log("Perhaps you didn't 'make install' ?")
    throw e;
}

var BlockIdToBlock = {}
var BlockNameToBlock = {}

// Create block lookup table.
for(var BlockKey in MinecraftData.blocks){
    var CurrentBlock = MinecraftData.blocks[BlockKey]
    BlockIdToBlock[CurrentBlock.id] = CurrentBlock
    BlockNameToBlock[CurrentBlock.name] = CurrentBlock
}

// Create generation table

var Generators = {}

fs.readdirSync(__dirname + "/world/generators").forEach(function(FileName){
    Generators[FileName.slice(0, -3)] = __dirname + "/world/generators/" + FileName
})

Assert(Object.keys(BlockNameToBlock).length > 0, "Block name to block id lookup table is empty")

// Load configuration.
var NewConfig;

try{
    NewConfig = JSON.parse(fs.readFileSync(__dirname + "/FlyingPony.conf"))
}catch(e){
    console.log("There was a problem reading the configuration file. (FlyingPony.conf)")
    throw e;
}

Inheritance(NewConfig, Config)

module.exports = {
    Deasync: Deasync,
    Deasyncp: Deasyncp,
    NBTParse: Deasync(PrismarineNBT.parse),
    MinecraftProtocol: MinecraftProtocol,
    MinecraftData: MinecraftData,
    PrismarineAnvil: PrismarineAnvil,
    PrismarineChunk: PrismarineChunk,
    PrismarineNBT: PrismarineNBT,
    PrismarineWorld: PrismarineWorld,
    PrismarineWorldSync: PrismarineWorldSync,
    Vec3: Vec3,
    UUID: UUID,
    ParallelProcesses: ParallelProcesses,
    internal: {
        blockIdToBlock: BlockIdToBlock,
        blockNameToBlock: BlockNameToBlock,
        Config: Config,
        generators: Generators
    }
}