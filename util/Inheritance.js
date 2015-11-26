module.exports = function(Parent, Child){
    // Make sure the child did not use a taken method
    if(Child.parent != undefined) throw new Error("Child is using the keyword 'parent'");
    
    // Move attributes and methods from parent to child
    for(key in Parent){
        if(typeof Parent[key] == 'function'){
            // It's a function, so bind it to the child
            
            if(Parent[key].__original__ == undefined){
                // It must be the first time it's been defined in parent
                
                Child[key] = Parent[key].bind(Child)
                Child[key].__original__ = Parent[key]
                
            }else{
                // It's already been inherited
                
                Child[key] = Parent[key].__original__.bind(Child)
                Child[key].__original__ = Parent[key].__original__
            }
        }else{
            // It's an attribute
            
            Child[key] = Parent[key]
        }
    }
    
    Child.parent = Parent
}