//

var Library = require("../Library.js")
var PrismarineChunk = Library.PrismarineChunk("1.8.8")
var Vec3 = Library.Vec3

module.exports = function generator(ChunkX, ChunkZ){
    var CurrentChunk = new PrismarineChunk()
    
    for(var x = 0; x < 16; x++){
        for(var z = 0; z < 16; z++){
           CurrentChunk.setBlockType(new Vec3(x, 0, z), 2)
           
           for (var y = 0; y < 256; y++) {
              CurrentChunk.setSkyLight(new Vec3(x, y, z), 15)
           }
        }
    }
    
    return CurrentChunk
}