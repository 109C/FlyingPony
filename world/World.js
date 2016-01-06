//

var Library = require("../Library.js")
var Logger = require("../logger/Logger.js")
var WorldBlock = require("./WorldBlock.js")

var Assert = require("../util/Assert.js")
var Validate = require("../util/Validate.js")
var Inheritance = require("../util/Inheritance.js")
var Convert = require("../util/Convert.js")

var PrismarineChunk = Library.PrismarineChunk
var nameToBlock = Library.internal.blockNameToBlock

module.exports = function World(Server, WorldGeneratorPath, WorldSeed){
    Assert(typeof Server == 'object', "Invalid server")
    Assert(typeof WorldGeneratorPath == 'string', "Invalid world generator path, should be string")
    Assert(typeof WorldSeed == 'string', "Invalid world seed")
    
    Inheritance(new WorldBlock(Server, WorldGeneratorPath, WorldSeed), this)
    
    var Self = this;
    
    this.Logger = new Logger("World")
    
    this.players = {}
    this.entities = {}
    
    this.generateUEID = function(){
        return Server.generateUEID()
    }
    var ParentTick = this.tick
    this.tick = function(){
        var Events = []
        
        // Do world stuff
        ParentTick.apply(this, []).forEach(function(Event){
            Events.push(Event)
        })
        
        // Tick all entities in the world
        for(EntityKey in this.entities){
            var Entity = this.entities[EntityKey]
            Entity.tick().forEach(function(Event){
                Events.push(Event)
            })
        }
        
        return Events
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