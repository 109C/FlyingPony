module.exports = onLoad

function onLoad(API){
    var CommandEvent = API.getEvent("CommandEvent")
    
    API.registerCommand("sudo", function(Command){
        var args = Command.getArgs()
        
        if(args.length < 2){
            showHelp()
            return true
        }
        
        var newPlayer = API.getPlayer(args[0])
        var commandName = args[1]
        var newArgs = args.slice(2)
        
        if(newPlayer == undefined || commandName == undefined){
            showHelp()
            return true
        }
        
        API.emit(new CommandEvent(newPlayer, commandName, newArgs))
        Command.getSender().tellRaw({text:"Executed command '" + commandName + "' as player '" + args[0] + "'", color: "green" })
        return true
        
        function showHelp(){
            Command.getSender().tellRaw({text:"Usage: /sudo [player name] [command] [args...]", color:"red"})
        }
    })
}