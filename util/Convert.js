module.exports = {
    "Convert360To256": Convert360To256
}

function Convert360To256(Yaw360){
    var Yaw256 = Math.floor(((Yaw360 % 360) / 360) * 255)
    
    if(Yaw256 > 127){
        Yaw256 -= 255
    }
    if(Yaw256 < -128){
        Yaw256 += 255
    }
    return Yaw256
}

