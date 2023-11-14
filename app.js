const { faker } = require('@faker-js/faker');
const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});


// CREATE TABLE users (
//     email VARCHAR(255) PRIMARY KEY,
//     created_at TIMESTAMP DEFAULT NOW()
// );



// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', __dirname + '/views');

// Define a route
app.get('/', (req, res) => {
    let msg = ""
    const person = {
        email: faker.internet.email(),
        created_at: faker.date.past()
    };

    console.log(person)

    const end_result = connection.query('INSERT INTO users SET ?', person, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    const q = 'SELECT COUNT(*) as count FROM users';
    connection.query(q, function (error, results) {
        if (error) throw error;
        const msg = "We have " + results[0].count + " users";
        console.log("message", msg)


        // Render the EJS template
        res.render('index', { title: msg, newEmail: person.email });
    })







});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
