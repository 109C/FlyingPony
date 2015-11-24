module.exports = function(Server, Event){
    Event.getEntity().getNearbyPlayers(64).forEach(function(Player){
        Player.sendEntitySpawn(Event.getEntity())
    })
}