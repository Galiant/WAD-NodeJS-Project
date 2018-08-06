var express = require("express"); // call express to be used by the application
var app = express();
var mysql = require('mysql'); // allow access to sql
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'pug'); // use pug like view engine in application
app.use(express.static("scripts"));  // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images"));  // allow the application to access the images folder contents to use in the application

const db = mysql.createConnection({
    host: 'den1.mysql1.gear.host',
    user: 'babylife',
    password: 'Qg46g5?Z2N5_',
    database: 'babylife'
});

db.connect((err) => {
    if(err) {
        console.log("Database isn't connected........Please check login details.......");
        // throw(err)
    } else {
        console.log("Well done. You are connected to database......");
    }
});

// Create a database table
app.get('/createtable', function(req, res) {
    let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Brand varchar(255), Category varchar(255), Price int, Image varchar(255));';
    
    let query = db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
    });
   res.send("Table changed........."); 
});

// SQL Insert Data Example
app.get('/insert', function(req, res) {
    let sql = 'INSERT INTO products (Name, Brand, Category, Price, Image) VALUES ("Baby Elegance Venti Travel System - Navy", "Baby Elegance", "Travel System", 449.99, "venti.jpg");';
    let query = db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
    });
   res.send("Product created.........Thank you........");
});

// SQL Query just for show Example
app.get('/queryme', function(req, res) {
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err, res) => {
        if(err) throw err;
        console.log(res);
    });
   res.send("Look in the console........");
});

// Function to render the home page
app.get('/', function(req,res) {
    // res.send("<h1>Hello World</h1>"); // This is commented out to allow the index view to be rendered
    res.render('index', {root: VIEWS});
    console.log("Now you are on the home page!");
});

// Function to render the products page
app.get('/products', function(req,res) {
    // res.send("<h1>Hello World</h1>"); // This is commented out to allow the index view to be rendered
    let sql = 'SELECT * FROM products;';
    let query = db.query(sql, (err, res1) => {
        if(err)
        throw(err);
    
    res.render('products', {root: VIEWS, res1}); // use the render command so that response object renders a HTML page
    });
    console.log("Now you are on the products page!");
});

// Set the requirements for application to run
app.listen(process.env.port || 8080, process.env.IP || "0.0.0.0" , function() {
    console.log("App is running ......... Yessssssssss!");
});