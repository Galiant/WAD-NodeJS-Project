var express = require("express"); // call express to be used by the application
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.use(express.static("scripts"));  // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images"));  // allow the application to access the images folder contents to use in the application

// Function to render the home page
app.get('/', function(req,res) {
    // res.send("<h1>Hello World</h1>"); // This is commented out to allow the index view to be rendered
    res.render('index.pug', {root: VIEWS});
    console.log("Now you are on the home page!");
});

// Function to render the products page
app.get('/products', function(req,res) {
    // res.send("<h1>Hello World</h1>"); // This is commented out to allow the index view to be rendered
    res.render('products.pug', {root: VIEWS}); // use the render command so that response object renders a HTML page
    console.log("Now you are on the products page!");
});

// Set the requirements for application to run
app.listen(process.env.port || 8080, process.env.IP || "0.0.0.0" , function() {
    console.log("App is running ......... Yessssssssss!");
});