//

var child_process = require("child_process")
var os = require("os")
var util = require("util")

module.exports = function WorkerManager(ChildPath, NumWorkers){
    var NumWorkers = NumWorkers || os.cpus().length
    var Self = this;
    
    this.workers = {}
    this.freeWorkers = {}
    this.pidToCallback = {}
    
    this.exposedData = {}
    
    this.run = function(Message, Callback){
        // Wait until we have a free worker, if necessary.
        if(Object.keys(this.freeWorkers).length < 1){
            
            // Wait until there is a free thread.
            var RetryInterval = setInterval(function(){
                if(Object.keys(Self.freeWorkers).length > 0){
                    clearInterval(RetryInterval)
                    Self.forceRun(Message, Callback)
                }
            }, 50)
        }else{
            this.forceRun(Message, Callback)
        }
    }
    
    this.forceRun = function(Message, Callback){
        // Make sure we have a worker available.
        if(Object.keys(this.freeWorkers).length < 1) throw new Error("No free worker thread available");
        
        
        // Select a random worker to use.
        
        var RandomIndex = Math.floor(Math.random() * (Object.keys(this.freeWorkers).length - 1))
        var RandomPid = Object.keys(this.freeWorkers)[RandomIndex]
        var RandomWorker = this.freeWorkers[RandomPid]
        
        // Update the info about whether the worker is being used.
        
        this.pidToCallback[RandomWorker.pid] = Callback
        delete this.freeWorkers[RandomWorker.pid]
        
        RandomWorker.send("R00000" + Message)
    }
    
    this.kill = function(){
        // Kill all the workers, and prevent any new requests to be made.
        
        Object.keys(this.workers).forEach(function(Key){
            Self.workers[Key].kill()
        })
        var ErrorFunction = function(){
            throw new Error("Cannot run, all the children are dead");
        }
        
        this.exposedData = {}
        this.run = ErrorFunction
        this.forceRun = ErrorFunction
        this.expose = ErrorFunction
    }
    this.expose = function(Key, Data){
        this.exposedData[Key] = Data
    }
    
    // Init workers, and add listeners.
    
    for(var i = 0; i < NumWorkers; i++){
        // Closure so there isn't any interaction between iterations.
        (function(){
            var Child = child_process.fork(__dirname + "/ChildLoader.js")
            
            // Tell the child proc where the file it should use is.
            Child.send(ChildPath)
            
            Self.workers[Child.pid] = Child
            Self.freeWorkers[Child.pid] = Child
            
            Child.on('exit', function(){
                delete Self.workers[Child.pid]
                
                // If we where the last one, terminate the manager
                if(Object.keys(Self.workers).length < 1){
                    Self.kill()
                }
            })
            
            Child.on('message', function(Message){
                // Format:  "M" | "E" + uid + message payload
                // Sizes:   1           5     rest of message
                
                //console.log("Child -> Parent: " + Message)
                
                var MessageMetadata = Message.slice(0, 6)
                var MessageData = Message.slice(6)
                
                if(MessageMetadata[0] == "M"){
                    // JSON.stringify fails on recursive structures, but there's not
                    // much of a choice when sending recursive structures.
                    // (Possible, but a pain)
                    Child.send("M" + MessageMetadata.slice(1) + JSON.stringify(Self.exposedData[MessageData]))
                    
                }else if(MessageMetadata[0] == "E"){
                    // Parse in case it was a json literal.
                    Self.pidToCallback[Child.pid](JSON.parse(MessageData))
                    delete Self.pidToCallback[Child.pid]
                    
                    Self.freeWorkers[Child.pid] = Child
                }else{
                    throw new Error("Invalid message header (" + MessageMetadata[0] + ")")
                }
            })
        })();
    }
}