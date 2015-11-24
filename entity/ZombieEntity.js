var EntityMob = require("./EntityMob.js")
var Inheritance = require("../util/Inheritance.js")

module.exports = function Zombie(UEID, World){
    Inheritance(new EntityMob(UEID, World), this)
    
    this.getMobId = function(){
        return 54
    }
}