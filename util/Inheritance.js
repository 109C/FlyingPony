module.exports = function(Parent, Child){
    for(key in Parent){
        Child[key] = Parent[key]
    }
}