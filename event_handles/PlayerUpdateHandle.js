module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    
    
    var SentChunkThisTick = false
            
    var PlayerChunkX = Math.floor(Player.position.x / 16 )
    var PlayerChunkZ = Math.floor(Player.position.z / 16 )
    
    // Only send one chunk per tick, as the client refuses any other chunks after the first few.
    
    for(var OffsetX = -4; OffsetX < 5; OffsetX++){
        if(SentChunkThisTick == true) break
        
        for(var OffsetZ = -4; OffsetZ < 5; OffsetZ++){
            if(SentChunkThisTick == true) break
            
            CurrentChunkX = PlayerChunkX + OffsetX
            CurrentChunkZ = PlayerChunkZ + OffsetZ
            if(Player.sentChunks[ "" + CurrentChunkX + "|" + CurrentChunkZ] == true) continue
            
            Player.rawWorld.getColumn(CurrentChunkX, CurrentChunkZ)
                .then(function(Chunk){
                        Player.sendChunkData(CurrentChunkX, CurrentChunkZ, Chunk.dump(), true)
                      },
                      function(err){
                        JSON.stringify(err.stack.split("\n").forEach(function(s){
                            console.log(s)
                        }))
                      })
            Player.sentChunks["" + CurrentChunkX + "|" + CurrentChunkZ] = true
            SentChunkThisTick = true
        }
    }
    
    // If we sent new chunks, unload the out of view distance ones.
    
    if(SentChunkThisTick == true){
        for(var ChunkKey in Player.sentChunks){
            var ChunkX = ChunkKey.split("|")[0]
            var ChunkZ = ChunkKey.split("|")[1]
            
            // Don't unload the chunks immediately, so that we don't waste bandwidth
            // sending chunks back to a player that keep crossing chunk border.
            
            if(Math.abs(PlayerChunkX - ChunkX) > 6 || Math.abs(PlayerChunkZ - ChunkZ) > 6){
                Player.sendChunkData(ChunkX, ChunkZ, new Buffer(0), false)
                delete Player.sentChunks[ChunkKey]
                break;
            }
        }
    }
}