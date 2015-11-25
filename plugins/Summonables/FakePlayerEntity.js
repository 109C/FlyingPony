//

var Inheritance = require("../../util/Inheritance.js")
var PlayerEntity = require("../../entity/PlayerEntity.js")

module.exports = function FakePlayer(UEID, Username, World){
    Inheritance(new PlayerEntity(UEID, {username:Username, write: function(){}}, World), this)
}