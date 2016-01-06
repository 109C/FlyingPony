//

var Inheritance = require("../util/Inheritance.js")

module.exports = function Logger(Prefix){
    
    Inheritance({}, this)
    
    this._prefix = Prefix
    this.log = function(Message){
        console.log("[" + this._prefix + "] " + Message)
    }
}