module.exports = function(a1, a2){
    if(Intersects1D(a1.x1, a1.x2, a2.x1, a2.x2) && Intersects1D(a1.y1, a1.y2, a2.y1, a2.y2)){
        return true
    }else{
        return false
    }
}

function Intersects1D(p11, p12, p21, p22){
    // If both of l1's is smaller than l2's smaller value
    if(p11 < p21 && p12 < p21){
        return false
    }
    // If both of l1's is bigger than l2's bigger
    if(p11 > p22 && p12 > p22){
        return false
    }
    return true
}