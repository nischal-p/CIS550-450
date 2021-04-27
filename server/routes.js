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
    check_user : checkUser,
    user_signup : userSignup,
    getAccountPage : getAccountPage,
    getSongFromDB : getSongFromDB

}
