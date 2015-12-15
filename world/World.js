//

module.exports = function World(Server, PrismarineWorld){
    this.PrismarineWorld = PrismarineWorld
    this.players = {}
    this.entities = {}
    
    this.generateUEID = function(){
        return Server.generateUEID()
    }
}