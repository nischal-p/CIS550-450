const config = require("./db-config.js");
const mysql = require("mysql");

config.connectionLimit = 10;
const connection = mysql.createPool(config);

// for password hashing
var crypto = require("crypto");

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const checkLogin = (req, res) => {
    // grab username, password from the frontend form
    var username = req.body.email;
    var password = req.body.password;

    // compute hashed password
    var hashed_password = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    // query database to check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${username}' AND (password = '${hashed_password}' OR password = '${password}')`;

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            if (rows.length == 1) res.send(true);
            else res.send(false);
        }
    });
};

// TODO: implement signup
const userSignup = (req, res) => {
    // grab username, password from frontend form
    var username = req.body.email;
    var password = req.body.password;

    // hash password
    var hashed_password = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
    console.log("hashed Password: ", hashed_password);

    // make call to check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${username}' AND password = '${hashed_password}'`;

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            console.log("check user called!");

            if (rows.length == 0) {
                // insert into database with username, hashed password
                const insert_query = `INSERT INTO Users (email, password) VALUES ('${username}', '${hashed_password}')`;
                connection.query(insert_query, (err, rows, fields) => {
                    if (err) throw err;
                    else {
                        console.log(
                            "Success! User with email " +
                                username +
                                " inserted!"
                        );

                        res.send(true);
                    }
                });
            } else {
                console.log("User already exists");
            }
        }
    });
};

//Account Page based on Session ID (TODO: needs to be generated on login)
const getAccountPage = (req, res) => {
    //TODO, retrieve information based on Session ID
    //(Maybe need to make a new db table for this)

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
};

//Search Page based on keyword)
const getSongFromDB = (req, res) => {
    const query =
        `
    SELECT s.title, s.artist, s.mood, s.release_year, s.popularity
    FROM Songs AS s
    WHERE s.title LIKE "` +
        req.params.song_title +
        `"
    LIMIT 10;
    `;

    console.log("Sent Query with: " + req.params.song_title);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log("Got Response:" + rows);
            res.json(rows);
        }
    });
};

// Get the mood distribution of songs in user's saved songs
const getUserMoodDistro = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT count(ss.song_id) as num_songs, CEIL((mm.mood * 10)) AS mood_bucket
    FROM SavedSongs ss 
    JOIN Songs s ON s.spotify_id = ss.song_id 
    JOIN MoodMetrics mm ON mm.song_id = ss.song_id 
    WHERE ss.email = "${user_email}"
    GROUP BY mood_bucket
    ORDER BY mood_bucket ;
    `;

    console.log("User Mood Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
};

// Get the danceibilty distribution of songs in user's saved songs
const getUserDanceabilityDistro = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT count(ss.song_id) as num_songs, CEIL((s.danceability * 10)) AS dancebility_bucket
    FROM SavedSongs ss 
    JOIN Songs s ON s.spotify_id = ss.song_id 
    WHERE ss.email = "${user_email}"
    GROUP BY dancebility_bucket
    ORDER BY dancebility_bucket ;
    `;

    console.log("User Dancebility Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

// Get the danceibilty distribution of songs in user's saved songs
const getUserAcousticnessDistro = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT count(ss.song_id) as num_songs, CEIL((s.acousticness * 10)) AS acousticness_bucket
    FROM SavedSongs ss 
    JOIN Songs s ON s.spotify_id = ss.song_id 
    WHERE ss.email = "${user_email}"
    GROUP BY acousticness_bucket
    ORDER BY acousticness_bucket ;
    `;

    console.log("User Dancebility Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

module.exports = {
    check_login: checkLogin,
    user_signup: userSignup,
    getAccountPage: getAccountPage,
    getSongFromDB: getSongFromDB,
    getUserMoodDistro: getUserMoodDistro,
    getUserDanceabilityDistro: getUserDanceabilityDistro,
    getUserAcousticnessDistro: getUserAcousticnessDistro,
};
