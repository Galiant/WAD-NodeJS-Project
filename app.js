var express = require("express"); // call express to be used by the application
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
var fs = require('fs'); //file system

app.set('view engine', 'pug'); // allow the application to use jade templating system

var session = require('express-session');

var bodyParser = require("body-parser");  // allow application to manipulate data in application (create, delete, update)
app.use(bodyParser.urlencoded({extended: true}));

var mysql = require('mysql'); // allow access to SQL

app.use(express.static("scripts")); // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images"));  // allow the application to access the images folder contents to use in the application
app.use(express.static("model")); // allow the application to access the models folder contents to use in the application

var reviews = require("./model/reviews.json"); // allow the app to access the reviews.json file

app.use(session({ secret: "topsecret" })); // Required to make the session accessable throughout the application

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

app.get('/createusertable', function(req, res) {
  let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255));';
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
  });
  res.send("User Created.....");
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
  console.log("Status of this user is " + req.session.user); // Log out the session value
});

// Function to render the products page
app.get('/products', function(req, res){
  let sql = 'SELECT * FROM products;';
  let query = db.query(sql, (err, res1) => {
    if(err) throw(err);
    res.render('products', {root: VIEWS, res1}); // use the render command so that response object renders a HTML page
  });
  console.log("Now you are on products page!");
  console.log("Status of this user is " + req.session.user); // Log out the session value
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

// Function to render the create page
app.get('/create', function(req, res){
  res.render('create', {root: VIEWS});
  console.log("Now you are ready to create product!");
});

// Function to add data to database based on button press
app.post('/create', function(req, res){
  var name = req.body.name;
  let sql = 'INSERT INTO products (Name, Brand, Category, Image, Price) VALUES ("'+name+'", "'+req.body.brand+'", "'+req.body.category+'", "'+req.body.image+'", '+req.body.price+')';
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
    console.log("The name of the product is " + name);
  });
  res.render('index', {root: VIEWS});
});

// Function to edit database data based on button press and form
app.get('/edit/:id', function(req, res) {
  if(req.session.user == "Active") {
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'; 
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);
    res.render('edit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  });
  
  } else {
    res.render('login', {root: VIEWS});
  }
  console.log("Now you are ready to edit this product!");
});

// Function to update database data based on button press and form
app.post('/edit/:id', function(req, res) {
  let sql = 'UPDATE products SET Name = "'+req.body.newname+'", Brand = "'+req.body.newbrand+'", Category = "'+req.body.newcategory+'", Image = "'+req.body.newimage+'", Price = '+req.body.newprice+' WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res) => {
    if(err) throw(err);
    console.log(res);
  });
  res.redirect("/item/" + req.params.id);
});

// Function to delete database data based on button press
app.get('/delete/:id', function(req, res) {
  let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'; 
  let query = db.query(sql, (err, res1) =>{
    if(err)
    throw(err);
    res.redirect('/products'); // use the render command so that the response object renders a HHTML page
  });
  console.log("You delete this product.......");
});

// ******* From here is JSON data manipulation ******
app.get('/reviews', function(req, res) {
  res.render('reviews', {reviews:reviews}
  );
  console.log("Reviews are on.......");
});

// Function to render JSON page
app.get('/add', function(req, res) {
  res.render('add', {root: VIEWS});
  console.log("Now you are leaving feedback!");
});

// Post request to add JSON review
app.post('/add', function(req, res) {
  var count = Object.keys(reviews).length;  // Tells us how many products we have its not needed but is nice to show how we can do this
  console.log(count);
  
  // This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
  function getMax(reviews, id) {
    var max;
    for (var i=0; i<reviews.length; i++) {
      if (!max || parseInt(reviews[i][id]) > parseInt(max[id]))
        max = reviews[i];
    }
    return max;
  }
  
  var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
  var newId = maxPpg.id + 1;  // this creates a new variable called newID which is the max Id + 1
  console.log(newId); // We console log the new id for show reasons only
  
  // Create a new product based on what we have in our form on the add page 
  var review = {
    name: req.body.name, // name called from the add.jade page textbox
    id: newId, // this is the variable created above
    content: req.body.content, // content called from the add.jade page textbox
  };
  console.log(review); // Console log the new product 
  var json  = JSON.stringify(reviews); // Convert from object to string
  
  // The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
  fs.readFile('./model/reviews.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      throw(err);
   } else {
    reviews.push(review); // add the information from the above variable
    json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
    fs.writeFile('./model/reviews.json', json, 'utf8'); // Write the file back
  }});
  res.redirect("/reviews");
});

// Page to render edit review
// This function filters the reviews by looking for any review which has an Id the same as the one passed in the url
app.get('/editreview/:id', function(req, res) {
  function chooseReview(indOne) {
    return indOne.id === parseInt(req.params.id);
  }
  console.log("Id of this review is " + req.params.id);
  // declare a variable called indOne which is a filter of reviews based on the filtering function above
  var indOne = reviews.filter(chooseReview);
  // pass the filtered JSON data to the page as indOne
  res.render('editreview', {indOne:indOne});
  console.log("Edit review page shown");
});

// Create post request to edit the individual review
app.post('/editreview/:id', function(req, res) {
  var json = JSON.stringify(reviews);
  var keyToFind = parseInt(req.params.id); // Id passed through the url  
  var data = reviews; // declare data as the reviews json file  
  var index = data.map(function(review){review.id}).keyToFind; // use the parameter passed in the url as a pointer to find the correct review to edit
  var x = req.body.name;
  var y = req.body.content;  
  var z = parseInt(req.params.id);
  
  reviews.splice(index, 1, {name: x, content: y, id: z});
  
  json = JSON.stringify(reviews, null, 4);
  fs.writeFile('./model/reviews.json', json, 'utf8'); // Write the file back
  res.redirect("/reviews");
});

// Route to delete review
app.get('/deletereview/:id', function(req, res) {
  var json = JSON.stringify(reviews);
  var keyToFind = parseInt(req.params.id); // Id passed through the url
  var data = reviews;
  var index = data.map(function(d) {d['id'];}).indexOf(keyToFind);
  
  reviews.splice(index, 1);
  
  json = JSON.stringify(reviews, null, 4);
  fs.writeFile('./model/reviews.json', json, 'utf8'); // Write the file back
  res.redirect("/reviews");
});

// ******* End JSON ********

// ***** Search function *******
app.post('/search', function(req, res) {
  let sql = 'SELECT * FROM products WHERE name LIKE "%'+req.body.search+'%";';
  let query = db.query(sql, (err, res1) => {
    if(err)
    throw (err)
    // res.redirect("/error")
    
    res.render('products', {root: VIEWS, res1});
    console.log("Successful search......");
  });
});

// ++++++++++++ Login/Logout and registration functionality ++++++++++++++++
// Render register page
app.get('/register', function(req, res) {
  res.render('register', {root: VIEWS});
});

// Stick user into database
app.post('/register', function(req, res) {
  db.query('INSERT INTO users (Name, Email, Password) VALUES ("'+req.body.name+'", "'+req.body.email+'", "'+req.body.password+'")');
  
  req.session.user = "Active";
  // req.session.name = req.body.name;
  
  res.redirect('/');
});

// Render login page
app.get('/login', function(req, res) {
  res.render('login', {root: VIEWS});
});

app.post('/login', function(req, res) {
  var whichOne = req.body.name; // What does user type in the name text box
  var whichPass = req.body.password; // What does user type in the password text box
  
  let sql2 = 'SELECT name, password FROM users WHERE name = "'+req.body.name+'"';
  let query = db.query(sql2, (err, res2) => {
    if(err) throw(err);
    console.log(res2);
    
    var passx = res2[0].password;
    var passn = res2[0].name;
    
    req.session.user = "Active";
    
    
    if(passx == whichPass) {
    res.redirect('/products');
    console.log("You logged in as Password " + passx + " and Username " + passn);
    } else {
      
    }
  });
});

// We need to set the requirements for tech application to run
app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  console.log("App is running ........ Yesssssssssss!");
});