module.exports = function(Parent, Child){
    for(key in Parent){
        Child[key] = Parent[key]
    }
    
    var InheritanceChain = Parent.__inheritance__ || "[Root]"
    
    Child.__inheritance__ = InheritanceChain + " -> " + Child.constructor.name
}