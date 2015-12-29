//

// A simple wrapper around the module that contains the code is wanted to be run in
// another thread, so that porting is simpler.

var util = require('util')

var WaitingQuerys = {}

process.once('message', function(ChildPath){
    var ChildMain = require(ChildPath)
    
    process.on('message', function(Message){
        //console.log("Parent -> Child: " + Message)
        var MessageMetadata = Message.slice(0, 6)
        var MessageData = Message.slice(6)
        
        if(MessageMetadata[0] == "M"){
            // It was a query response.
            WaitingQuerys[MessageMetadata.slice(1)](JSON.parse(MessageData))
        }else if(MessageMetadata[0] == "R"){
            // It was a run request.
            try{
                var Answer = ChildMain(MessageData, function Query(Key, Callback){
                    var QueryKey = generateUID()
                    
                    WaitingQuerys[QueryKey] = Callback
                    process.send("M" + QueryKey + "" + Key)
                },
                function Done(Answer){
                    process.send("E00000" + JSON.stringify(Answer))
                })
                // Send the answer back to main, aka it was sync.
                if(Answer) process.send("E00000" + JSON.stringify(Answer));
            }catch(e){
                // In case the error is caught using some weird hack.
                process.nextTick(function(){
                    process.exit()
                })
                throw e;
            }
        }else{
            console.log(Message)
            throw new Error("Invalid header")
        }
    })
})

function generateUID(){
    // Format: 0.YYYYYxx...
    // Takes:    ^^^^^
    return Math.random().toString().split(".")[1].slice(0, 5)
}