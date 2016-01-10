//

var fs = require("fs")
var Convert = require("../util/Convert.js")
var Library = require("../Library.js")
var PrismarineNBT = Library.PrismarineNBT

var Folders = {
    "data/":{},
    "DIM-1/":{
        "region/":{}
    },
    "DIM1/":{
        "region/":{}
    },
    "playerdata/":{},
    "region/":{},
    "stats/":{}
}

var DefaultLevelData = require("./DefaultLevelData.json")
var DefaultLevelDatFile = PrismarineNBT.writeUncompressed({
    "type": "compound",
    "name": "",
    "value": {
        "Data": {
            "type": "compound",
            "value": DefaultLevelData
        }
    }
})

module.exports = function(FolderPath){
    if(fs.existsSync(FolderPath) == false){
        fs.mkdirSync(FolderPath)
    }
    
    MakeDirs(FolderPath, Folders)
    MakeLevelData(FolderPath)
}

function MakeDirs(BasePath, Tree){
    for(Key in Tree){
        if(Key[Key.length - 1] == "/"){
            var SubDirs = Tree[Key]
            
            if(fs.existsSync(BasePath + Key) == false){
                fs.mkdirSync(BasePath + Key)
            }
        
            MakeDirs(BasePath + Key, SubDirs)
        }
    }
}

function MakeLevelData(FolderPath){
    if(fs.existsSync(FolderPath + "level.dat") == false){
        var LevelDat = Convert.cloneObj(DefaultLevelData)
        
        LevelDat.Time.value = [0, 0]
        LevelDat.RandomSeed.value = [RandomInt(), RandomInt()]
        LevelDat.SpawnX.value = 0
        LevelDat.SpawnY.value = 64
        LevelDat.SpawnZ.value = 0
        
        var LevelDatBuf = PrismarineNBT.writeUncompressed({
            "type": "compound",
            "name": "",
            "value": {
                "Data": {
                    "type": "compound",
                    "value": DefaultLevelData
                }
            }
        })
        
        fs.writeFileSync(FolderPath + "level.dat", LevelDatBuf)
    }
}

function RandomInt(){
    Math.random(); // Magic
    return Math.floor(Math.random() * 2147483647)
}