//

var util = require("util")
var Assert = require("../util/Assert.js")

// Cache the generators, so we don't have to keep requiring them.

var Generators = {}

module.exports = function ChunkProcess(RequestArgs, Query, Done){
    var Args = JSON.parse(RequestArgs)
    
    Assert(typeof Args.Generator == 'string', "Invalid generator, should be path")
    Assert(typeof Args.ChunkX == 'number', "Invalid chunk x co-ordinate")
    Assert(typeof Args.ChunkZ == 'number', "Invalid chunk z co-ordinate")
    Assert(typeof Args.Seed == 'string', "Invalid seed, it should be a string")
    
    if(Generators[Args.Generator] == undefined){
        Generators[Args.Generator] = require(Args.Generator)
    }
    
    var Chunk = Generators[Args.Generator](Args.ChunkX, Args.ChunkZ, Args.Seed)
    Done(JSON.stringify(Chunk.dump()))
}