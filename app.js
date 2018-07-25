var express = require("express"); // call express to be used by the application
var app = express();

// Function to set up a simple hello response
app.get('/', function(req,res) {
    res.send("<h1>Hello World</h1>");
    console.log("Hello");
});

// Set the requirements for application to run
app.listen(process.env.port || 3000, process.env.IP || "0.0.0.0" , function() {
    console.log("App is running ......... Yessssssssss!");
});