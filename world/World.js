//

var path = require("path")
var Library = require("../Library.js")
var Logger = require("../logger/Logger.js")
var PrismarineWorld = Library.PrismarineWorld
var PrismarineWorldSync = Library.PrismarineWorldSync
var PrismarineChunk = Library.PrismarineChunk
var ParallelProcesses = Library.ParallelProcesses
var Vec3 = Library.Vec3
var nameToBlock = Library.internal.blockNameToBlock

var Assert = require("../util/Assert.js")
var Validate = require("../util/Validate.js")

module.exports = function World(Server, WorldGeneratorPath){
    Assert(typeof Server == "object", "Invalid server")
    Assert(typeof WorldGeneratorPath == "string", "Invalid world generator path, should be string")
    
    var Self = this;
    
    function DummyGenerator(){
        Self.log("Warning: dummy generator generated chunk, this should not happen")
        return new PrismarineChunk()
    }
    
    /* The prismarine world generates empty chunks, and they are filled in when we 
    || get the correct chunks from the chunk generator process.
    */
    this.PrismarineWorld = new PrismarineWorldSync(new PrismarineWorld(DummyGenerator))
    
    /* We pass an absolute path because paraproc uses require().
    || One worker is enough for now, but might be increased if we multicast the generator
    || to the workers.
    */
    this.ProcessManager = new ParallelProcesses(path.resolve(__dirname + "/../process/ChunkProc.js"), 1)
    this.ProcessManager.run(JSON.stringify({Generator: path.resolve(WorldGeneratorPath)}), function(){})
    
    this.loadedChunks = {}
    this.generatingChunks = {}
    
    this.Logger = new Logger("World")
    this.log = this.Logger.log.bind(this.Logger)
    
    this.players = {}
    this.entities = {}
    
    this.generateUEID = function(){
        return Server.generateUEID()
    }
    this.isChunkLoaded = function(ChunkX, ChunkZ){
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        
        if(this.loadedChunks[ChunkX + "|" + ChunkZ] == true){
            return true
        }else{
            return false
        }
    }
    this.requestChunkLoad = function(ChunkX, ChunkZ){
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        
        if(this.generatingChunks[ChunkX + "|" + ChunkZ] != undefined) return;
        
        this.generatingChunks[ChunkX + "|" + ChunkZ] = true
        
        var QueryArgs = {
            ChunkX: ChunkX,
            ChunkZ: ChunkZ
        }
        this.ProcessManager.run(JSON.stringify(QueryArgs), function(Response){
            var BufferArray = JSON.parse(Response).data
            var ChunkBuffer = new Buffer(BufferArray)
            var NewChunk = new PrismarineChunk()
            NewChunk.load(ChunkBuffer)

            
            Self.PrismarineWorld.setColumn(ChunkX, ChunkZ, NewChunk)
            Self.loadedChunks[ChunkX + "|" + ChunkZ] = true
            delete Self.generatingChunks[ChunkX + "|" + ChunkZ]
        })
    }
    this.getChunk = function(ChunkX, ChunkZ){
        return this.PrismarineWorld.getColumn(ChunkX, ChunkZ)
    }
    this.setChunk = function(ChunkX, ChunkZ, Chunk){}
    this.getBlock = function(Position){}
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