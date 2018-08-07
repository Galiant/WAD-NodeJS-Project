var express = require("express"); // call express to be used by the application
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'pug'); // allow the application to use jade templating system

var mysql = require('mysql'); // allow access to SQL

app.use(express.static("scripts")); // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images"));  // allow the application to access the images folder contents to use in the application

// Connect application with SQL database

const db = mysql.createConnection({
  host: 'den1.mysql1.gear.host',
  user: 'babyworld',
  password: 'Antonijo123@',
  database: 'babyworld'
});

db.connect((err) => {
  if(err) {
    console.log("Connection Refused.....Please check login details!");
    // throw(err);
  } else {
    console.log("Well done. You are connected.....");
  }
});

// Create a Database Table
app.get('/createtable', function(req, res) {
  let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Brand varchar(255), Category varchar(255), Image varchar(255), Price decimal(8,2));';
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
  });
  res.send("Table Created.....");
});

// SQL Insert Data Example
app.get('/insert', function(req, res) {
  let sql = 'INSERT INTO products (Name, Brand, Category, Image, Price) VALUES ("Venti Travel System - Navy", "Baby Elegance", "Travel System", "venti.jpg", 449.99)';
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
  });
  res.send("Item Created.....");
});

// SQL QUERY Just for show Example
app.get('/queryme', function(req, res) {
  let sql = 'SELECT * FROM products;';
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
  });
  res.send("Look in the console.....");
});

// Function to render the home page
app.get('/', function(req, res){
  res.render('index', {root: VIEWS});
  console.log("Now you are at home page!");
});

// Function to render the products page
app.get('/products', function(req, res){
  let sql = 'SELECT * FROM products;';
  let query = db.query(sql, (err, res1) => {
    if(err) throw(err);
    res.render('products', {root: VIEWS, res1}); // use the render command so that response object renders a HTML page
  });
  console.log("Now you are on products page!");
});

// Function to render the item page
app.get('/item/:id', function(req, res){
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";' 
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);
    res.render('item', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  });
  console.log("Now you are on the item page!");
});

// We need to set the requirements for tech application to run
app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  console.log("App is running ........ Yesssssssssss!");
});