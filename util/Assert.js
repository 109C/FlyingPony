// yay

module.exports = function(Condition, ErrorText){
    if(Condition != true){
        throw new Error(ErrorText)
    }
} 