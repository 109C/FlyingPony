// yay

var LogoutEvent = require("../events/LogoutEvent.js")

module.exports = function ClientAssert(Player, Server){
    function Assert(Condition, ErrorText){
        if(!Condition){
            Player.Client.end(ErrorText)
            Server.Scheduler.addEvent(1, new LogoutEvent(Player))
            console.log("Client failed assertion: " + "\n" + ErrorText)
        }
    }
    
    return Assert
    
}