module.exports = function(Server, Event){
    var Player = Event.getDigger()
    
    // Validate if player can hit the block.
    
    // Update the digging player.
    
    if(Event.isStart()){
        Player.startDigging(Event.getPosition(), Event.getFace())
    }else if(Event.isAbort()){
        Player.resetDigging()
    }else if(Event.isFinish()){
        Player.finishDigging(Event.getPosition())
    }else{
        throw new Error("Invalid dig event")
    }
}