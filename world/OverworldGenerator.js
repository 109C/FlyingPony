//

var Library = require("../Library.js")
var PrismarineChunk = Library.PrismarineChunk
var Vec3 = Library.Vec3

module.exports = function generator(ChunkX, ChunkZ){
    var CurrentChunk = new PrismarineChunk()
    
    for(var x = 0; x < 16; x++){
        for(var z = 0; z < 16; z++){
           for(var i = 0; i < 10; i++){
               CurrentChunk.setBlockType(new Vec3(x, i, z), 2)
           }
           
           for (var y = 0; y < 256; y++) {
              CurrentChunk.setSkyLight(new Vec3(x, y, z), 15)
           }
        }
    }
    return CurrentChunk
}