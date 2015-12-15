//

var MinecraftProtocol = require("./lib/minecraft-protocol")
var MinecraftData = require("./lib/minecraft-data")("1.8")
var PrismarineWorld = require("./lib/prismarine-world")
var PrismarineChunk = require("./lib/prismarine-chunk")
var Vec3 = require("./lib/vec3")
var UUID = require("./lib/uuid-1345")
var PrismarineWorldSync = require("./lib/prismarine-world-sync")

var BlockIdToBlock = {}
var BlockNameToBlock = {}

for(var BlockKey in MinecraftData.blocks){
    var CurrentBlock = MinecraftData.blocks[BlockKey]
    BlockIdToBlock[CurrentBlock.id] = CurrentBlock
    BlockNameToBlock[CurrentBlock.name] = CurrentBlock
}

module.exports = {
    MinecraftProtocol: MinecraftProtocol,
    MinecraftData: MinecraftData,
    PrismarineWorld: PrismarineWorld,
    PrismarineChunk: PrismarineChunk,
    Vec3: Vec3,
    UUID: UUID,
    PrismarineWorldSync: PrismarineWorldSync,
    internal: {
        blockIdToBlock: BlockIdToBlock,
        blockNameToBlock: BlockNameToBlock
    }
}