module.exports = Inheritance

function Inheritance(Parent, Child){
    for(key in Parent){
        Child[key] = Parent[key]
    }
    
    // Init child inheritance if it doesn't already have a parent.
    if(Child.__inheritance == undefined){
        Child.__inheritance__ = {parents:[], name: Child.constructor.name}
    }
    // Add parent to the child's parents.
    if(Parent.__inheritance__ == undefined){
        Child.__inheritance__.parents.push({parents:[], name: "[Root]"})
    }else{
        Child.__inheritance__.parents.push(Parent.__inheritance__)
    }
}

Inheritance.pprint = pprint

function pprint(Child){
    return JSON.stringify(Child.__inheritance__, null, 2)
}