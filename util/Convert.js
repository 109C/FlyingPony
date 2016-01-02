var Validate = require("./Validate.js")

module.exports = {
    "Convert360To256": Convert360To256,
    posToChunck: PosToChunk,
}

function Convert360To256(Yaw360){
    Assert(typeof Yaw360 == 'number', "Invalid yaw, should be a number")
    
    var Yaw256 = Math.floor(((Yaw360 % 360) / 360) * 255)
    
    if(Yaw256 > 127){
        Yaw256 -= 255
    }
    if(Yaw256 < -128){
        Yaw256 += 255
    }
    return Yaw256
}

function PosToChunk(Position){
    Assert(Validate.isVec3(Position) == true, "Invalid position, should be a vec3")
    
    var x = Math.floor(Position.x / 16)
    var z = Math.floor(Position.z / 16)
    
    return [x, z]
}