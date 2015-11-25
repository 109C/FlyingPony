//

var Library = require("./Library.js")

var MinecraftProtocol = Library.MinecraftProtocol
var MinecraftData = Library.MinecraftData
var PrismarineWorld = Library.PrismarineWorld
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

var Server = {}

Server.lobbyWorld = new World(new PrismarineWorld(LobbyGenerator))
Server.gameWorld = new World(new PrismarineWorld(GameMapGenerator))
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
    var Assert = ClientAssert(Client)
    var CurrentPlayer = new PlayerEntity(Server.generateUEID(), Client, Server.lobbyWorld)
    
    Client.on('end', function(){
        Server.Scheduler.addEvent(1, new LogoutEvent(CurrentPlayer))
    })
    Client.on('chat', function(data){
        Assert(data.message.length <= 119, "chat: Invalid chat message, too long")
        Server.Scheduler.addEvent(1, new IncomingMessageEvent(CurrentPlayer, data.message))
    })
    Client.on('position', function(packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(packet.x, packet.y, packet.z)), false)
    })
    Client.on('look', function(packet){
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, packet.pitch, packet.yaw, false))
    })
    Client.on('position_look', function(packet){
        Server.Scheduler.addEvent(1, new MoveEvent(CurrentPlayer, new Vec3(packet.x, packet.y, packet.z)), false)
        Server.Scheduler.addEvent(1, new LookEvent(CurrentPlayer, packet.pitch, packet.yaw, false))
    })
    Client.on('use_entity', function(packet){
        Assert(typeof CurrentPlayer.world.entities[packet.target] == 'object', "use_entity: Invalid ueid")
        Assert(packet.mouse == 0 || packet.mouse == 1 || packet.mouse == 2, "use_entity: Invalid mouse mode")
        Server.Scheduler.addEvent(1, new EntityUseEvent(CurrentPlayer, CurrentPlayer.world.entities[packet.target], packet.mouse))
    })
    Server.Scheduler.addEvent(1, new LoginEvent(CurrentPlayer))
}
Server.bootHandles.ClientConnection = function(Client){
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
