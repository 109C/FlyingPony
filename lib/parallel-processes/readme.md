# What is parallel processes

A simple framework to make running more than one piece of javascript at a time.

# Installation

`npm install parallel-processes`

Or alternatively, just download it as it is because it doesn't have any dependencies.

# Example usage

```
var parallelProcesses = require('parallel-processes')

var parallel = new parallelProcesses("path/to/module")

parallel.run(parameterToModule, function(response){
  console.log(response)
})
```

You can find a more in depth examples in the examples directory.