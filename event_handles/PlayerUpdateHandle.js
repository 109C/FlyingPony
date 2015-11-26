module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    
    
    var SentChunkThisTick = false
            
    var PlayerChunkX = Math.floor(Player.position.x / 16 )
    var PlayerChunkZ = Math.floor(Player.position.z / 16 )
    for(var OffsetX = -4; OffsetX < 5; OffsetX++){
        if(SentChunkThisTick == true) break
        
        for(var OffsetZ = -4; OffsetZ < 5; OffsetZ++){
            if(SentChunkThisTick == true) break
            
            CurrentChunkX = PlayerChunkX + OffsetX
            CurrentChunkZ = PlayerChunkZ + OffsetZ
            if(Player.sentChunks[ "" + CurrentChunkX + "|" + CurrentChunkZ] == true) continue
            
            Player.rawWorld.getColumn(CurrentChunkX, CurrentChunkZ)
                .then(function(Chunk){
                        Player.sendChunkData(CurrentChunkX, CurrentChunkZ, Chunk)
                      },
                      function(err){
                        JSON.stringify(err.stack.split("\n").forEach(function(s){
                            console.log(s)
                        }))
                      })
            Player.sentChunks["" + CurrentChunkX + CurrentChunkZ] = true
            SentChunkThisTick = true
        }
    }
}