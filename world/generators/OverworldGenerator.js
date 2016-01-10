//

var Library = require("../../Library.js")
var PrismarineChunk = Library.PrismarineChunk
var blockNameToBlock = Library.internal.blockNameToBlock
var Vec3 = Library.Vec3

module.exports = function generator(ChunkX, ChunkZ, Seed){
    var CurrentChunk = new PrismarineChunk()
    
    for(var x = 0; x < 16; x++){
        for(var z = 0; z < 16; z++){
            var GlobalX = x + ChunkX * 16
            var GlobalZ = z + ChunkZ * 16
            
            var ThresholdX = Math.cos(GlobalX / 10) * 5 + 10
            var ThresholdZ = Math.cos(GlobalZ / 10) * 5 + 10
            
            var ThresholdSquared = Math.abs(ThresholdX * ThresholdZ)
            
            for (var y = 0; y < 256; y++) {
                CurrentChunk.setSkyLight(new Vec3(x, y, z), 15)
                
                if((y + 1) * (y + 1) < ThresholdSquared){
                    CurrentChunk.setBlockType(new Vec3(x, y, z), blockNameToBlock["dirt"].id)
                }else if(y * y < ThresholdSquared){
                    CurrentChunk.setBlockType(new Vec3(x, y, z), blockNameToBlock["grass"].id)
                }
                
                //CurrentChunk.setBlockType(new Vec3(x, y, z), blockNameToBlock["grass"].id)
            }
            // Gen trees
            
        }
    }
    return CurrentChunk
}