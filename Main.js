//

var path = require("path")
var Library = require("./Library.js")
var MinecraftProtocol = Library.MinecraftProtocol
var MinecraftData = Library.MinecraftData
var ParallelProcesses = Library.ParallelProcesses
var Vec3 = Library.Vec3

var Logger = require("./logger/Logger")
var ClientAssert = require("./util/ClientAssert.js")

var EventLoop = require("./event_loop/EventLoop.js")
var Scheduler = require("./event_loop/Scheduler.js")
var PluginManager = require("./plugin_manager/PluginManager")

var OverworldGenerator = require("./world/OverworldGenerator.js")

var PlayerEntity = require("./entity/PlayerEntity.js")
var World = require("./world/World.js")

var LoginEvent = require("./events/LoginEvent.js")
var LogoutEvent = require("./events/LogoutEvent.js")
var IncomingMessageEvent = require("./events/IncomingMessageEvent.js")
var MoveEvent = require("./events/MoveEvent.js")
var LookEvent = require("./events/LookEvent.js")
var EntityUseEvent = require("./events/EntityUseEvent.js")
var PlayerDigEvent = require("./events/PlayerDigEvent.js")

var Server = {}

Server.Overworld = new World(Server, __dirname + "/world/generators/OverworldGenerator.js", JSON.stringify(123456789))

Server.worlds = [Server.Overworld]

Server.Logger = new Logger("Core")
Server.Scheduler = new Scheduler()
Server.PluginManager = new PluginManager()
Server.MinecraftProtocolServer = MinecraftProtocol.createServer(Library.internal.Config)
Server.eventLoop = EventLoop

/*
|| Chunk generator processes manager. Any arbitrary amount of workers can be spawned.
*/
Server.ChunkGeneratorPool = new ParallelProcesses(path.resolve(__dirname + "/process/ChunkProc.js"), 2)

Server.UUID = Library.UUID

/*
|| For some reason, when the UEIDs do not start at tara strong's age the
|| spawn packet causes the client to freeze.
*/
Server.UEID = 42

Server.eventLoopInterval = 0
Server.tps = 0
Server.bootHandles = {}
Server.players = {}

Server.generateUEID = function(){
    Server.UEID++
    return Server.UEID
}

Server.bootHandles.PlayerLogin = function(Client){
    var CurrentPlayer = new PlayerEntity(Server.generateUEID(), Client, Server.Overworld)
    var Assert = ClientAssert(CurrentPlayer, Server)
    
    // Make sure the player isn't already logged in.
    if(Server.players[Client.username] != undefined){
        Client.end("You are already logged in!")
        Server.Logger.log("Player '" +Client.username+ "' (" +Client.socket.remoteAddress+ ") attempted to login twice!")
        return;
    }
    
    Client.on('end', function(){
        Server.Scheduler.addEvent(1, new LogoutEvent(CurrentPlayer))
    })
    Client.on('chat', function(Packet){
        Assert(Packet.message.length <= 119, "chat: Invalid chat message, too long")
        Server.Scheduler.addEvent(1, new IncomingMessageEvent(CurrentPlayer, Packet.message))
    })
    Client.on('position', function(Packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(Packet.x, Packet.y, Packet.z), false))
    })
    Client.on('look', function(Packet){
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, Packet.pitch, Packet.yaw, false))
    })
    Client.on('position_look', function(Packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(Packet.x, Packet.y, Packet.z), false))
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, Packet.pitch, Packet.yaw, false))
    })
    Client.on('use_entity', function(Packet){
        Assert(typeof CurrentPlayer.world.entities[Packet.target] == 'object', "use_entity: Invalid ueid")
        Assert(Packet.mouse == 0 || Packet.mouse == 1 || Packet.mouse == 2, "use_entity: Invalid mouse mode")
        
        var Position = new Vec3(Packet.x, Packet.y, Packet.z)
        Server.Scheduler.addEvent(1, new EntityUseEvent(CurrentPlayer, CurrentPlayer.world.entities[Packet.target], Packet.mouse, Position))
    })
    Client.on('block_dig', function(Packet){
        Assert(Packet.status >= 0 && Packet.status <= 5, "block_dig: Invalid status (Action type)")
        Assert(Packet.face >= 0 && Packet.face <= 5, "block_dig: Invalid block face")
        
        var Position = new Vec3(Packet.location.x, Packet.location.y, Packet.location.z)
        
        Assert(CurrentPlayer.world.isBlockLoaded(Position) == true, "block_dig: Invalid location, not loaded")
        
        // Dig start, Dig abort, Dig finish.
        if(Packet.status == 0 || Packet.status == 1 || Packet.status == 2){
            Server.Scheduler.addEvent(1, new PlayerDigEvent(CurrentPlayer, Position, Packet.face, Packet.status))
        }
    })
    Server.Scheduler.addEvent(1, new LoginEvent(CurrentPlayer))
}
Server.bootHandles.ClientConnection = function(Client){
    Client.on('error', function(ErrorMessage){
        Server.Logger.log("A client had an error:")
        Server.Logger.log(ErrorMessage)
        Server.Logger.log("Something went wrong, shutting down server.")
        throw ErrorMessage;
    })
}

Server.initialize = function(){
    Server.MinecraftProtocolServer.on("login", Server.bootHandles.PlayerLogin)
    Server.MinecraftProtocolServer.on("connection", Server.bootHandles.ClientConnection)
    
    var LastTime = Date.now()
    var CurrentTicks = 0;
    
    // Event loop.
    Server.eventLoopInterval = setInterval(function(){
        var TickStart = Date.now()
        
        Server.eventLoop(Server)
        
        var TickTotal = Date.now() - TickStart
        
        if(TickTotal > 100){
            Server.Logger.log("A Tick took " + TickTotal + " milliseconds to execute. (" + (TickTotal / 50) + " times the usual)")
        }
        
        CurrentTicks++
        if(Date.now() - LastTime > 1000){
            Server.tps = CurrentTicks
            LastTime = Date.now()
            CurrentTicks = 0
        }
    }, 50)
    
    Server.PluginManager.loadPlugins(Server, __dirname + "/plugins/")
}


Server.initialize()
