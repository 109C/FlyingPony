//

/*
|| NOTE: this is temporary. It will be replaced with an actual render.
*/

var fs = require("fs")

var ItemStack = require("./items/ItemStack.js")
var World = require("./world/World.js")

var ClassesRaw = fs.readFileSync(__dirname + "/Doc/ClassOverview.json").toString()
var Classes = JSON.parse(ClassesRaw)

var ClassTemplate = fs.readFileSync(__dirname + "/Doc/ClassTemplate.html").toString()
var ClassHeader = fs.readFileSync(__dirname + "/Doc/ClassHeader.html").toString()

var FuncNames = []
var HTML = "";

for(ClassName in Classes){
    var Class = Classes[ClassName]
    
    var FuncName = ["[Undocumented]"]
    var Parents = ["[Undocumented]"]
    var Methods = ["[Undocumented]"]
    var Attr = ["[Undocumented]"]
    
    if(Class.args == undefined){
       // We can't gen documents if the args are not specified.
    }else{
        var ApplyArgs = []
        Class.args.forEach(function(Arg){
            if(Arg == undefined){
                ApplyArgs.push(undefined)
            }else if(Arg.complex == undefined){
                 ApplyArgs.push(Arg)
            }else{
                if(Arg.complex == "item"){
                    ApplyArgs.push(new ItemStack("iron_shovel", 1))
                }else if(Arg.complex == "world"){
                    ApplyArgs.push(new World({}, "/path/to/gen", "123456789"))
                }else if(Arg.complex == "client"){
                    ApplyArgs.push({
                        username: "TestPlayer",
                        write: function(){},
                        socket:{
                            remoteAddress: "127.0.0.1"
                        }
                    })
                }
            }
            
        })
        
        var ClassRaw = require("./" + ClassName)
        
        var ToEval = "new ClassRaw("
        
        ApplyArgs.forEach(function(Arg, Index, Whole){
            ToEval += "ApplyArgs[" + Index + "]"
            if(Index != Whole.length - 1) ToEval += ","
        })
        
        ToEval += ")"
        
        var Instance = eval(ToEval)
        
        Parents = []
        Methods = []
        Attr = []
        
        FuncName = Instance.__inheritance__.name
        Instance.__inheritance__.parents.forEach(function(Parent){
            Parents.push(Parent.name)
        })
        
        for(Key in Instance){
            var Value = Instance[Key]
            
            if(Key[0] == "_") continue;
            
            if(typeof Value == 'function'){
                Methods.push(Key)
            }else{
                Attr.push(Key)
            }
        }
        
    }
    
    var Out = ClassTemplate
    
    Out = Out.split("%CLASSPATH%").join(ClassName)
    Out = Out.split("%CLASSNAME%").join(FuncName)
    
    Out = DoSubLoop(Out, "%PARENTS%", "%PARENT%", Parents)
    Out = DoSubLoop(Out, "%METHODS%", "%METHOD%", Methods)
    Out = DoSubLoop(Out, "%ATTRS%", "%ATTR%", Attr)
    
    HTML += Out
    
    FuncNames.push(FuncName)
    
}

var Header = ClassHeader

Header = DoSubLoop(Header, "%CLASSES%", "%CLASSNAME%", FuncNames)

HTML = Header + HTML
HTML = "<!-- DO NOT EDIT THIS PAGE, IT WAS AUTOMATICALLY GENERATED -->\n" +
       "<!-- Instead, please edit ClassTemplate.html, or ClassHeader.html -->\n" + HTML

fs.writeFileSync(__dirname + "/Doc/Class.html", HTML)

function DoSubLoop(Out, PluralKeyword, SingleKeyword, SubValues){
    var OutPlural = Out.split(PluralKeyword)
    
    SubValues.sort(function(a, b){
        if(a.toLowerCase() > b.toLowerCase()){
            return 1;
        }else if(a < b){
            return -1;
        }else{
            return 0;
        }
    })
    
    OutPlural.forEach(function(Part, Index, Whole){
        if(Index == 0) return;
        Template = Part.split("}")[0].split("{")[1]
        
        var PostText = Part.slice(Template.length + 2, Part.length + 1)
        
        var CurrentText = ""
        
        
        SubValues.forEach(function(SubValue){
            CurrentText += Template.split(SingleKeyword).join(SubValue)
        })
        OutPlural[Index] = CurrentText + PostText
        
        
    })
    
    return OutPlural.join("")
}