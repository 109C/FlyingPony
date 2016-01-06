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
                if(Plugin.enabled == false) continue;
                if(Plugin.commands[Command]){
                    if( Plugin.commands[Command].apply(Plugin.Interface, [Event]) ) return true;
                }
            }
        }
        
        // Do the plugins event listeners
        for(PluginKey in this.plugins){
            var Plugin = this.plugins[PluginKey]
            if(Plugin.enabled == false) continue;
            if(Plugin.listeners[Event.getType()]){
                if( Plugin.listeners[Event.getType()].apply(Plugin.Interface, [Event]) ) return true;
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
        	_self.loadPlugin(Server, PluginRoot)
        })
    }
    
    this.loadPlugin = function(Server, PluginRoot){
        if(fs.existsSync(PluginRoot) == false){
            this.Logger.log("Invalid path to plugin")
        }
        try{
            var PluginInfo = JSON.parse(fs.readFileSync(PluginRoot + "Plugin.json"))
        }catch(e){
            this.Logger.log("Malformed plugin.json in folder " + "'" + PluginRoot + "'")
        }
        
        var Folder;
        {
            var Parts = PluginRoot.split("/")
            if(Parts[Parts.length - 1] == ""){
                 Folder = Parts[Parts.length - 2]
            }else{
                Folder = Parts[Parts.length - 1]
            }
        }
        
        this.plugins[Folder] = {
            "info" : PluginInfo,
            "pluginRoot": PluginRoot,
            "commands": {},
            "listeners": {
                "PluginEnable": function(){},
                "PluginDisable": function(){}
            },
            "enabled": true
        }
        
        var CurrentPlugin = this.plugins[Folder]
        
        Assert(typeof PluginInfo.PluginFile == "string", "Malformed plugin in plugin folder " + "(" + Folder + ")")
        
        // DANGER
        var Plugin = require("../plugins/" + Folder + "/" + PluginInfo.PluginFile)
        var Interface = new PluginInterface(Server, CurrentPlugin)
        
        this.plugins[Folder].Interface = Interface
        
        Plugin.call(Interface)
        
        this.Logger.log("Loaded plugin " + Folder)
    }
    
    this.enablePlugin = function(PluginName){
        var Plugin = this.plugins[PluginName]
        if(Plugin == undefined) return;
        
        Plugin.enabled = true
        
        if(Plugin.listeners["PluginEnable"] != undefined){
            Plugin.listeners["PluginEnable"].apply(Plugin, [])
        }
    }
    this.disablePlugin = function(PluginName){
        var Plugin = this.plugins[PluginName]
        if(Plugin == undefined) return;
        
        if(Plugin.listeners["PluginDisable"] != undefined){
            Plugin.listeners["PluginDisable"].apply(Plugin, [])
        }
        Plugin.enabled = false
    }
    this.reloadPlugin = function(PluginName){
        this.disablePlugin(PluginName)
        this.enablePlugin(PluginName)
    }
}