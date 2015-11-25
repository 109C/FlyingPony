// yay

module.exports = function ClientAssert(_Client){
    function Assert(Condition, ErrorText){
        if(!Condition){
            Client.end(ErrorText)
            console.log("Client failed assertion: " + "\n" + ErrorText)
        }
    }
    
    return Assert
    
}