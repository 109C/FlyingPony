// yay

var LogoutEvent = require("../events/LogoutEvent.js")
var Logger = require("../logger/Logger.js")

var AssertLogger = new Logger("Assert")

module.exports = function ClientAssert(Player, Server){
    function Assert(Condition, ErrorText){
        if(!Condition){
            Player.Client.end(ErrorText)
            Server.Scheduler.addEvent(1, new LogoutEvent(Player))
            AssertLogger.log("Client '" + Player.Client.socket.remoteAddress + "' failed assertion: " + "\n" + ErrorText)
        }
    }
    
    return Assert
    
}