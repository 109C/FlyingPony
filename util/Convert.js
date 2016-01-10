var Validate = require("./Validate.js")
var Assert = require("./Assert.js")

module.exports = {
    "Convert360To256": Convert360To256,
    posToChunk: PosToChunk,
    cloneObj: CloneObj
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

function CloneObj(Obj){
    var NewObj = {}
    for(var Key in Obj){
        if(Obj[Key].constructor.name == "Object"){
            NewObj[Key] = CloneObj(Obj[Key])
        }else{
            NewObj[Key] = Obj[Key]
        }
    }
    return NewObj
}