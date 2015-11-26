module.exports = onLoad

function onLoad(){
    var CommandEvent = this.getEvent("CommandEvent")
    
    this.registerCommand("sudo", function(Command){
        var args = Command.getArgs()
        
        if(args.length < 2){
            showHelp()
            return true
        }
        
        
        var newPlayer = this.getPlayer(args[0])
        var commandName = args[1]
        var newArgs = args.slice(2)
        
        if(newPlayer == undefined || commandName == undefined){
            showHelp()
            return true
        }
        
        this.emit(new CommandEvent(newPlayer, commandName, newArgs))
        Command.hasSender() &&  Command.getSender().tellRaw({text:"Executed command '" + commandName + "' as player '" + args[0] + "'", color: "green" })
        return true
        
        function showHelp(){
            Command.hasSender() && Command.getSender().tellRaw({text:"Usage: /sudo [player name] [command] [args...]", color:"red"})
        }
    })
}