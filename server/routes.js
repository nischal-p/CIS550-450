const config = require('./db-config.js')
const mysql = require('mysql')

config.connectionLimit = 10
const connection = mysql.createPool(config)


// for password hashing
var crypto = require('crypto');


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


// TODO: implement checkUser for login
const checkLogin = (req, res) => {
    // grab username, password from the frontend form
    var username = req.body.username;
    var password = req.body.password;

    // query database to check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${username}' AND password = '${password}'`

    connection.query(query, (rows) => {
        console.log(rows)
        if (rows.length == 1) res.send(true)
        else res.send(false)
    })
}


// TODO: implement signup
const userSignup = (req, res) => {
    
}

//Account Page based on Session ID (TODO: needs to be generated on login)
const getAccountPage = (req, res) => {

    //TODO, retrieve information based on Session ID
    //(Maybe need to make a new db table for this)

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else {res.json(rows)};
    });
};

//Search Page based on keyword)
const getSongFromDB = (req, res) => {

    const query = `
    SELECT s.title, s.artist, s.mood, s.release_year, s.popularity
    FROM Songs AS s
    WHERE s.title LIKE "`+ req.params.song_title + `"
    LIMIT 10;
    `;

    console.log("Sent Query with: " + req.params.song_title);
    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else {console.log("Got Response:" + rows); res.json(rows);}
    });
};



module.exports = {
    check_login : checkLogin,
    user_signup : userSignup,
    getAccountPage : getAccountPage,
    getSongFromDB : getSongFromDB
}