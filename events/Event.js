var Inheritance = require("../util/Inheritance.js")

module.exports = function Event(){
    Inheritance({}, this)
    
    this.getType = function(){
        return "Event"
    }
}