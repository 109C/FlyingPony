//

module.exports = function Logger(Prefix){
    this._prefix = Prefix
    this.log = function(Message){
        console.log("[" + this._prefix + "] " + Message)
    }
}