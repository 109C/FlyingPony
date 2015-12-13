module.exports = {
    isVec3: isVec3
}

function isVec3(Position){
    return typeof Position == 'object'
        && typeof Position.x == 'number'
        && typeof Position.y == 'number'
        && typeof Position.z == 'number'
        && typeof Position.floored == 'function'
}