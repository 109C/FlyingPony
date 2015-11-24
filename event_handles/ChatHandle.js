module.exports = function(Server, Event){
    var Message;
    if (Event.hasSender()){
        Message = {}
        Message.translate = "chat.type.text"
        Message.with = []
        Message.with.push(Event.getSender().username)
        Message.with.push(Event.getMessage())
    }else{
        if(typeof Event.getMessage() == "string"){
            Message = {"text": Event.getMessage()}
        }else{
            Message = Event.getMessage()
        }
    }
    if(Event.hasReciever()){
        Event.getReciever().tellRaw(Message)
    }else{
        for(PlayerKey in Server.players){
            var CurrentPlayer = Server.players[PlayerKey]
            CurrentPlayer.tellRaw(Message)
        }
    }
}