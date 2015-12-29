var parallelProcesses = require("../")

var doublerModulePath = __dirname + "/doubler.js"


/* Make three separate node processes that handle doubling requests. Thus, only three
|| numbers can be being doubled at the same time. The amount can be increased to
|| make it faster, as long as you have that many processors.
*/
var manager = new parallelProcesses(doublerModulePath, 3)


// Numbers to double and print to console.
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Some random data that the child can access.
var someData  = {
    text: "Arbitrary data here, I could put anything here",
    biggestNumber: 0,
    r: someData
}

/* Tell the manager that the children can access it. Note that the child receives a copy
|| of the object, not a reference because javascript is synchronous.
*/
manager.expose("someData", someData)

/* Double all of the numbers. Keep in mind this is asynchronous, so they arrive
|| in different order than they where sent in.
*/
numbers.forEach(function(element){
    manager.run(element, function(reponse){
        console.log( element + " doubled is " + reponse)
        someData.biggestNumber = element > someData.biggestNumber ? element : someData.biggestNumber
    })
})

/* By default, the process manager does not kill it's processes when it's the only
|| task in the event loop, so we kill it manually after 5 seconds.
*/

setTimeout(manager.kill.bind(manager), 1000 * 5)