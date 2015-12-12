//

var Library = require("./Library.js")

var MinecraftProtocol = Library.MinecraftProtocol
var MinecraftData = Library.MinecraftData
var PrismarineWorld = Library.PrismarineWorld
var PrismarineWorldSync = Library.PrismarineWorldSync
var Vec3 = Library.Vec3
var UUID = Library.UUID

var Logger = require("./logger/Logger")
var ClientAssert = require("./util/ClientAssert.js")

var EventLoop = require("./event_loop/EventLoop.js")
var Scheduler = require("./event_loop/Scheduler.js")
var PluginManager = require("./plugin_manager/PluginManager")

var LobbyGenerator = require("./world/LobbyGenerator.js")
var GameMapGenerator = require("./world/GameGenerator.js")

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

Server.lobbyWorld = new World(new PrismarineWorldSync(new PrismarineWorld(LobbyGenerator)))
Server.gameWorld = new World(new PrismarineWorldSync(new PrismarineWorld(GameMapGenerator)))
Server.worlds = [Server.lobbyWorld, Server.gameWorld]
Server.Logger = new Logger("Core")
Server.Scheduler = new Scheduler()
Server.PluginManager = new PluginManager()
Server.MinecraftProtocolServer = MinecraftProtocol.createServer({"online-mode": false})
Server.eventLoop = EventLoop

Server.UUID = UUID
Server.UEID = 0
Server.eventLoopInterval = 0
Server.bootHandles = {}
Server.players = {}

Server.generateUEID = function(){
    Server.UEID++
    return Server.UEID
}

Server.bootHandles.PlayerLogin = function(Client){
    var CurrentPlayer = new PlayerEntity(Server.generateUEID(), Client, Server.lobbyWorld)
    var Assert = ClientAssert(CurrentPlayer, Server)
    
    Client.on('end', function(){
        Server.Scheduler.addEvent(1, new LogoutEvent(CurrentPlayer))
    })
    Client.on('chat', function(Packet){
        Assert(data.message.length <= 119, "chat: Invalid chat message, too long")
        Server.Scheduler.addEvent(1, new IncomingMessageEvent(CurrentPlayer, Packet.message))
    })
    Client.on('position', function(Packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(Packet.x, Packet.y, Packet.z)), false)
    })
    Client.on('look', function(Packet){
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, Packet.pitch, Packet.yaw, false))
    })
    Client.on('position_look', function(Packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(Packet.x, Packet.y, Packet.z)), false)
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, Packet.pitch, Packet.yaw, false))
    })
    Client.on('use_entity', function(Packet){
        Assert(typeof CurrentPlayer.world.entities[Packet.target] == 'object', "use_entity: Invalid ueid")
        Assert(Packet.mouse == 0 || Packet.mouse == 1 || Packet.mouse == 2, "use_entity: Invalid mouse mode")
        
        Server.Scheduler.addEvent(1, new EntityUseEvent(CurrentPlayer, CurrentPlayer.world.entities[Packet.target], Packet.mouse))
    })
    Client.on('block_dig', function(Packet){
        Assert(Packet.status >= 0 && Packet.status <= 5, "block_dig: Invalid status (Action type)")
        Assert(Packet.face >= 0 && Packet.face <= 5, "block_dig: Invalid block face")
        
        // Dig start, Dig abort, Dig finish.
        if(Packet.status == 0 || Packet.status == 1 || Packet.status == 2){
            Server,Scheduler.addEvent(1, new PlayerDigEvent(CurrentPlayer, Packet.location, Packet.face, Packet.status))
        }
    })
    Server.Scheduler.addEvent(1, new LoginEvent(CurrentPlayer))
}
Server.bootHandles.ClientConnection = function(Client){
    Client.on('error', function(e){
        Server.Logger.log("A client had an error:")
        Server.Logger.log(e)
    })
    if(Server.players[Client.username] != undefined){
        Client.end("You are already logged in")
    }
}

Server.initialize = function(){
    Server.MinecraftProtocolServer.on("login", Server.bootHandles.PlayerLogin)
    Server.MinecraftProtocolServer.on("connection", Server.bootHandles.ClientConnection)
    
    Server.eventLoopInterval = setInterval(function(){
        Server.eventLoop(Server)
    }, 50)
    
    Server.PluginManager.loadPlugins(Server, __dirname + "/plugins/")
}



Server.initialize()
