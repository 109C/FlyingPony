//

var Library = require("../Library.js")
var nameToBlock = Library.internal.blockNameToBlock

var Assert = require("../util/Assert.js")
var Validate = require("../util/Validate.js")

module.exports = function World(Server, PrismarineWorld){
    Assert(typeof Server == "object", "Invalid server")
    Assert(typeof PrismarineWorld == "object", "Invalid prismarine world")
    
    this.PrismarineWorld = PrismarineWorld
    this.players = {}
    this.entities = {}
    
    this.generateUEID = function(){
        return Server.generateUEID()
    }
    this.setBlock = function(Position, BlockName, BlockMeta){
        Assert(Validate.isVec3(Position) == true, "Invalid position, should be a vec3")
        Assert(typeof BlockName == "string", "Invalid block name, should be string")
        Assert(typeof nameToBlock[BlockName] == 'object', "Invalid block name, not found in name to block table")
        Assert(typeof BlockMeta == "number" || typeof BlockMeta == "undefined" || BlockMeta === null, "Invalid block meta")
        
        this.PrismarineWorld.setBlock(Position, {
                type: nameToBlock[BlockName].id,
                metadata: BlockMeta
        })
        
        this.getNearbyPlayers(Position).forEach(function(Player){
            Player.sendBlockUpdate(Position, nameToBlock[BlockName].id, BlockMeta)
        })
        
    }
    this.getNearbyPlayers = function(Position){
        Assert(Validate.isVec3(Position) == true, "Invalid position, should be vec3")
        
        var ChunkX = Math.floor(Position.x / 16)
        var ChunkZ = Math.floor(Position.z / 16)
        var NearPlayers = []
        
        for(Key in this.players){
            var Player = this.players[Key]
            if(Player.sentChunks["" + ChunkX + "|" + ChunkZ] == true){
                NearPlayers.push(Player)
            }
        }
        
        return NearPlayers
    }
}