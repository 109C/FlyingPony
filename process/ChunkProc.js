//

var util = require("util")
var Library = require("../Library.js")
var PrismarineWorld = Library.PrismarineWorld
var PrismarineWorldSync = Library.PrismarineWorldSync
var Vec3 = Library.Vec3

var World;

module.exports = function ChunkProcess(RequestArgs, Query, Done){
    var Args = JSON.parse(RequestArgs)
    
    if(Args.Generator){
        World = new PrismarineWorldSync(new PrismarineWorld(require(Args.Generator)))
        Done(1);
    }else if(typeof Args.ChunkX == 'number' && typeof Args.ChunkZ == 'number'){
        var Chunk = World.getColumn(Args.ChunkX, Args.ChunkZ)
        Done(JSON.stringify(Chunk.dump()));
    }else{
        throw new Error("Invalid args: " + RequestArgs)
    }
}