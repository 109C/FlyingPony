//

var path = require("path")
var Logger = require("../logger/Logger.js")
var ChunkLoadEvent = require("../events/ChunkLoadEvent.js")
var Library = require("../Library.js")

var PrismarineWorld = Library.PrismarineWorld
var PrismarineWorldSync = Library.PrismarineWorldSync
var PrismarineChunk = Library.PrismarineChunk
var nameToBlock = Library.internal.blockNameToBlock

var Assert = require("../util/Assert.js")
var Validate = require("../util/Validate.js")
var Inheritance = require("../util/Inheritance.js")
var Convert = require("../util/Convert.js")

module.exports = function WorldBlock(Server, WorldGeneratorPath, WorldSeed){
    Assert(typeof Server == 'object', "Invalid server")
    Assert(typeof WorldGeneratorPath == "string", "Invalid world generator path, should be string")
    Assert(typeof WorldSeed == 'string', "Invalid world seed")
    
    Inheritance({}, this)
    
    var Self = this
    
    function DummyGenerator(){
        Self.Logger.log("Warning: dummy generator generated chunk in main process, this should NOT happen!")
        return new PrismarineChunk()
    }
    
    /* The prismarine world generates empty chunks, and they are filled in when we 
    || get the correct chunks from the chunk generator process.
    */
    this._PrismarineWorld = new PrismarineWorldSync(new PrismarineWorld(DummyGenerator))
    
    this.Logger = new Logger("World Block")
    
    this.seed = WorldSeed
    this.generatorPath = path.resolve(WorldGeneratorPath)
    this._loadedChunks = {}
    this.generatingChunks = {}
    
    
    this.isChunkLoaded = function(ChunkX, ChunkZ){
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        
        if(this._loadedChunks[ChunkX + "|" + ChunkZ] == true){
            return true
        }else{
            return false
        }
    }
    this.isBlockLoaded = function(Position){
        Assert(Validate.isVec3(Position) == true, "Invalid position, should be a vec3")
        var XZ = Convert.posToChunk(Position)
        return this.isChunkLoaded(XZ[0], XZ[1])
    }
    
    this.requestChunkLoad = function(ChunkX, ChunkZ){
        // TODO: when world saving is implemented, load the chunks from disk.
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        
        if(this.isChunkLoaded(ChunkX, ChunkZ) == true) return;
        if(this.generatingChunks[ChunkX + "|" + ChunkZ] == true) return;
        
        this.generatingChunks[ChunkX + "|" + ChunkZ] = true
        
        var QueryArgs = {
            Generator: this.generatorPath,
            Seed: this.seed,
            ChunkX: ChunkX,
            ChunkZ: ChunkZ
        }
        Server.ChunkGeneratorPool.run(JSON.stringify(QueryArgs), function(Response){
            if(Self == undefined) return;
            
            var BufferArray = JSON.parse(Response).data
            var ChunkBuffer = new Buffer(BufferArray)
            var NewChunk = new PrismarineChunk()
            NewChunk.load(ChunkBuffer)
            
            Server.Scheduler.addEvent(1, new ChunkLoadEvent(Self, NewChunk, ChunkX, ChunkZ))
        })
    }
    this.tick = function(){
        return [];
    }
    this.getChunk = function(ChunkX, ChunkZ){
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        if(this.isChunkLoaded(ChunkX, ChunkZ) == true){
            return this._PrismarineWorld.getColumn(ChunkX, ChunkZ)
        }else{
            throw new Error("Invalid chunk request, the chunk not loaded.")
        }
    }
    this.setChunk = function(ChunkX, ChunkZ, Chunk){
        Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
        Assert(typeof ChunkX == 'number', "Invalid chunk z co-ordinate")
        Assert(typeof Chunk == 'object', "Invalid chunk, should be instance of prismarine-chunk")
        
        // Load the chunk and mark it as loaded
        
        this._PrismarineWorld.setColumn(ChunkX, ChunkZ, Chunk)
        this._loadedChunks[ChunkX + "|" + ChunkZ] = true
        delete this.generatingChunks[ChunkX + "|" + ChunkZ]
    }
    this.getBlock = function(Position){
        Assert(Validate.isVec3(Position) == true, "Invalid position, should be a vec3")
        var XZ = Convert.posToChunk(Position)
        Assert(this.isChunkLoaded(XZ[0], XZ[1]) == true, "Invalid position, chunk is not loaded")
        
        return this._PrismarineWorld.getBlock(Position)
    }
    this.setBlock = function(Position, BlockName, BlockMeta){
        Assert(Validate.isVec3(Position) == true, "Invalid position, should be a vec3")
        Assert(typeof BlockName == "string", "Invalid block name, should be string")
        Assert(typeof nameToBlock[BlockName] == 'object', "Invalid block name, not found in name to block table")
        Assert(typeof BlockMeta == "number" || typeof BlockMeta == "undefined" || BlockMeta === null, "Invalid block meta")
        
        this._PrismarineWorld.setBlock(Position, {
                type: nameToBlock[BlockName].id,
                metadata: BlockMeta
        })
        
        this.getNearbyPlayers(Position).forEach(function(Player){
            Player.sendBlockUpdate(Position, nameToBlock[BlockName].id, BlockMeta)
        })
        
    }
    this.getNearbyPlayers = function(Position){
        return [];
    }
}