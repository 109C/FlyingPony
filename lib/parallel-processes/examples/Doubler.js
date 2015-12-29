module.exports = function numberDoubler(requestArgs, query, done){
    query("someData", function(answer){
        console.log("Doubling the number " + requestArgs + ". The biggest number so far is " + answer.biggestNumber)
        done(requestArgs * 2)
    })
}