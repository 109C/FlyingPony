module.exports = function(Server, Event){
    Event.getWorld().setChunk(Event.getChunkX(), Event.getChunkZ(), Event.getChunk())
}