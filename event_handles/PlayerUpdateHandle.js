var Library = require("../Library.js")

module.exports = function(Server, Event){
    var Player = Event.getPlayer()
    var VDistance = Library.internal.Config["view-distance-chunks"]
    
    var SentChunkThisTick = false
            
    var PlayerChunkX = Math.floor(Player.position.x / 16 )
    var PlayerChunkZ = Math.floor(Player.position.z / 16 )
    
    // Only send one chunk per tick, as the client refuses any other chunks after the first few.
    
    for(var OffsetX = -VDistance; OffsetX <= VDistance; OffsetX++){
        for(var OffsetZ = -VDistance; OffsetZ <= VDistance; OffsetZ++){
            
            CurrentChunkX = PlayerChunkX + OffsetX
            CurrentChunkZ = PlayerChunkZ + OffsetZ
            if(Player.sentChunks[ "" + CurrentChunkX + "|" + CurrentChunkZ] == true) continue
            
            var ChunkToSend =  Player.rawWorld.getColumn(CurrentChunkX, CurrentChunkZ)
            Player.sendChunkData(CurrentChunkX, CurrentChunkZ, ChunkToSend.dump(), true)
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
            // sending chunks back to a player that keeps crossing chunk borders.
            
            if(Math.abs(PlayerChunkX - ChunkX) > (VDistance + 2) || Math.abs(PlayerChunkZ - ChunkZ) > (VDistance + 2)){
                Player.sendChunkData(ChunkX, ChunkZ, new Buffer(0), false)
                delete Player.sentChunks[ChunkKey]
            }
        }
    }
    
    // Mark the player as not fully spawned if necessary, so we don't tick-freeze the client.
    
    Player.loadingChunks = SentChunkThisTick
    
    if(Player.loadingChunks == false){
        for(var EntityKey in Player.nearbyEntities){
        	var Entity = Player.nearbyEntities[EntityKey]
        	
        	// Spawn the appropriate entities client side.
            if(Player.hasSpawnedEntity(Entity) == false && Entity.hasValidStance()){
                Player.sendEntitySpawn(Entity)
                break; // Only spawn one entity per tick.
            }
            
            // Spawn the appropriate entities client side.
            if(Player.distanceTo(Entity) > 64){
                Player.sendEntityDespawn(Entity)
            }
        }
    }
}