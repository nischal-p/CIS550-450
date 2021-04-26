const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

// for password hashing
var crypto = require('crypto');


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


// TODO: implement checkUser for login
const checkUser = (req, res) => {
    // TODO: query database for user id/unhashed password
}


// TODO: implement signup
const userSignup = (req, res) => {

}



module.exports = {
    check_user : checkUser,
    user_signup : userSignup
}