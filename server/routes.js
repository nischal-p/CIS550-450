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



module.exports = {
    check_login : checkLogin,
    user_signup : userSignup
}