//

var fs = require("fs")

var Logger = require("../logger/Logger.js")
var Assert = require("../util/Assert.js")

var PluginInterface = require("./PluginInterface.js")

module.exports = function PluginManager(){
	var _self = this
	
    this.Logger = new Logger("PluginManager")
    this.plugins = {}
    
    this.triggerEvent = function(Server, Event){
        
        // Do the plugins command listeners
        if(Event.getType() == "CommandEvent"){
            var Command = Event.getCommand().toLowerCase()
            for(PluginKey in this.plugins){
                var Plugin = this.plugins[PluginKey]
                if(Plugin.commands[Command]){
                    if( Plugin.commands[Command].apply(Plugin, [Event]) ) return true;
                }
            }
        }
        
        // Do the plugins event listeners
        for(PluginKey in this.plugins){
            var Plugin = this.plugins[PluginKey]
            if(Plugin.listeners[Event.getType()]){
                if( Plugin.listeners[Event.getType()].apply(Plugin, [Event]) ) return true;
            }
        }
        
        return false
    }
    
    this.loadPlugins = function(Server, Path){
        var Folders = fs.readdirSync(Path)
        var PluginFolders = []
        
        Folders.forEach(function(Folder){
            if(fs.existsSync(Path + "/" + Folder + "/" + "Plugin.json")){
                _self.Logger.log("Plugin found in folder " + "'" + Folder + "'")
                PluginFolders.push(Folder)
            }else{
                _self.Logger.log("Non-plugin folder in plugins folder. " + "(" + Folder + ")")
            }
        })
        
        PluginFolders.forEach(function(Folder){
        	var PluginRoot = Path + "/" + Folder + "/"
        	try{
                var PluginInfo = JSON.parse(fs.readFileSync(PluginRoot + "Plugin.json"))
            }catch(e){
                _self.Logger.log("Malformed plugin.json in folder " + "'" + Folder + "'")
            }
            
            _self.plugins[Folder] = {
                "info" : PluginInfo,
                "pluginRoot": PluginRoot,
                "commands": {},
                "listeners": {}
            }
            
            var CurrentPlugin = _self.plugins[Folder]
            
            Assert(typeof PluginInfo.PluginFile == "string", "Malformed plugin in plugin folder " + "(" + Folder + ")")
            
            // DANGER
            var Plugin = require("../plugins/" + Folder + "/" + PluginInfo.PluginFile)
            var Interface = new PluginInterface(Server, CurrentPlugin)
            
            Plugin(Interface)
        })
    }
    this.disablePlugin = function(PluginName){
        delete this.plugins[PluginName]
    }
}