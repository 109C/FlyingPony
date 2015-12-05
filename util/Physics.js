module.exports = {
    calculateDrag: calculateDrag
}

function calculateDrag(Velocity){
    Velocity.x = drag1D(Velocity.x)
    Velocity.y = drag1D(Velocity.y)
    Velocity.z = drag1D(Velocity.z)
}

function drag1D(Magnitude){
    if(Magnitude > 0){
        // Moving forwards.
        Magnitude = ((Magnitude - 0.02) > 0) ? (Magnitude - 0.02) : (0)
    }else{
        // Moving backwards.
        Magnitude = ((Magnitude + 0.02) < 0) ? (Magnitude + 0.02) : (0)
    }
    return Magnitude
}