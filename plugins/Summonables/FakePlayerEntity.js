//

var Inheritance = require("../../util/Inheritance.js")
var PlayerEntity = require("../../entity/PlayerEntity.js")

module.exports = function FakePlayer(UEID, Username, World){
    var FakeClient = {
        username: Username,
        write: function(){},
        Client:{
            socket:{
                remoteAddress: "127.0.0.1"
            }
        }
    }
    Inheritance(new PlayerEntity(UEID, FakeClient, World), this)
    
    this.isGravitational = function(){
        return true
    }
}