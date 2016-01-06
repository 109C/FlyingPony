var Event = require("./Event.js")
var Inheritance = require("../util/Inheritance.js")
var Assert = require("../util/Assert.js")

module.exports = function ChunkLoadEvent(World, Chunk, ChunkX, ChunkZ){
    Assert(typeof World == 'object', "Invalid world")
    Assert(typeof Chunk == 'object', "Invalid chunk")
    Assert(typeof ChunkX == 'number', "Invalid chunk x co-ordinate")
    Assert(typeof ChunkZ == 'number', "Invalid chunk z co-ordinate")
    
    Inheritance(new Event(), this)
    
    this._world = World
    this._chunk = Chunk
    this._chunkX = ChunkX
    this._chunkZ = ChunkZ
    
    this.getWorld = function(){
        return this._world
    }
    this.getChunk = function(){
        return this._chunk
    }
    this.getChunkX = function(){
        return this._chunkX
    }
    this.getChunkZ = function(){
        return this._chunkZ
    }
    this.getType = function(){
        return "ChunkLoadEvent"
    }
}