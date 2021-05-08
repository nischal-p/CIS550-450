const config = require("./db-config.js");
const mysql = require("mysql");
var request = require("request");

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

const getSongFromDB = (req, res) => {
    const song_name = req.params.song_title;

    const query = `
  SELECT s.title, s.spotify_id, a.name, s.explicit
  FROM Songs s
  JOIN ArtistsSongs a2
  ON s.spotify_id = a2.song_id
  JOIN Artists a
  ON a2.artist_id = a.artist_id
  WHERE s.title LIKE '${song_name}'
  LIMIT 10
  `;

    // query database for song with song_name + attributes
    console.log("Sent Query with: " + song_name);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log("Got Response:" + JSON.stringify(rows));

            // query spotify API for songs
            var client_id = "8eab0cca59954ff8b78151cbc3b7c2ea";
            var client_secret = "a2119aead89a4308876d6385ee0a5263";

            // your application requests authorization from spotify
            var authOptions = {
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    Authorization:
                        "Basic " +
                        new Buffer(client_id + ":" + client_secret).toString(
                            "base64"
                        ),
                },
                form: {
                    grant_type: "client_credentials",
                },
                json: true,
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // instantiate result array
                    var result = [];
                    for (var i = 0; i < rows.length; i++) {
                        // query spotify api with target id
                        var options = {
                            url:
                                "https://api.spotify.com/v1/tracks/" +
                                rows[i].spotify_id,
                            headers: {
                                Authorization: "Bearer " + body.access_token,
                            },
                            json: true,
                        };

                        // assemble result array to pass to frontend component
                        request.get(options, function (err, response, body) {
                            console.log(body);
                            result.push({
                                artist_name: body["artists"][0]["name"],
                                song_name: body["name"],
                                img_src: body["album"]["images"][1]["url"],
                                duration: body["duration_ms"],
                                link: body["external_urls"]["spotify"],
                            });

                            // pass final result to frontend
                            if (result.length == rows.length) {
                                res.json(result);
                            }
                        });
                    }
                }
            });
        }
    });
};

const getSongBasedOnArtist = (req, res) => {
    const artist_name = req.params.artist_name;

    const query = `
  SELECT s.title, s.spotify_id, a.name, s.explicit
  FROM Artists a
  JOIN ArtistsSongs as2
  ON a.artist_id = as2.artist_id
  JOIN Songs s
  ON as2.song_id = s.spotify_id
  WHERE a.name LIKE '${artist_name}'
  LIMIT 10`;

    console.log("Sent query with " + artist_name);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log("Got Response:" + JSON.stringify(rows));

            // query spotify API for songs
            var client_id = "8eab0cca59954ff8b78151cbc3b7c2ea";
            var client_secret = "a2119aead89a4308876d6385ee0a5263";

            // your application requests authorization from spotify
            var authOptions = {
                url: "https://accounts.spotify.com/api/token",
                headers: {
                    Authorization:
                        "Basic " +
                        new Buffer(client_id + ":" + client_secret).toString(
                            "base64"
                        ),
                },
                form: {
                    grant_type: "client_credentials",
                },
                json: true,
            };

            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // instantiate result array
                    var result = [];
                    for (var i = 0; i < rows.length; i++) {
                        // query spotify api with target id
                        var options = {
                            url:
                                "https://api.spotify.com/v1/tracks/" +
                                rows[i].spotify_id,
                            headers: {
                                Authorization: "Bearer " + body.access_token,
                            },
                            json: true,
                        };

                        // assemble result array to pass to frontend component
                        request.get(options, function (err, response, body) {
                            result.push({
                                artist_name: body["artists"][0]["name"],
                                song_name: body["name"],
                                img_src: body["album"]["images"][1]["url"],
                                duration: body["duration_ms"],
                                link: body["external_urls"]["spotify"],
                            });

                            // pass final result to frontend
                            if (result.length == rows.length) {
                                res.json(result);
                            }
                        });
                    }
                }
            });
        }
    });
};

// Get the mood distribution of songs in user's saved songs
const getUserMoodDistro = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT count(ss.song_id) as num_songs, CEIL((s.mood * 10)) AS mood_bucket
    FROM SavedSongs ss 
    JOIN Songs s ON s.spotify_id = ss.song_id 
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

// Get the acosticness distribution of songs in user's saved songs
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

// Get the popularity distribution of songs in user's saved songs
const getUserPopularityDistro = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT count(ss.song_id) AS num_songs, CEIL((s.popularity / 10)) AS popularity_bucket
    FROM SavedSongs ss 
    JOIN Songs s ON s.spotify_id = ss.song_id 
    WHERE ss.email = "${user_email}"
    GROUP BY popularity_bucket
    ORDER BY popularity_bucket;
    `;

    console.log("User Popularity Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

// Get the danceibilty distribution of songs in user's saved songs
const getUserTopArtists = (req, res) => {
    const user_email = req.params.email;

    const query = `
    WITH artistid_songcount AS (
        SELECT ats.artist_id , count(ss.song_id) AS num_songs
        FROM SavedSongs ss 
        JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
        WHERE ss.email = "${user_email}"
        GROUP BY ats.artist_id 
    )
    SELECT a.name, num_songs 
    FROM artistid_songcount atsng
    JOIN Artists a ON a.artist_id = atsng.artist_id
    ORDER BY num_songs DESC
    LIMIT 10;
    `;

    console.log("User Top Artists Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getUserTopGenres = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT ag.genre AS text, count(ss.song_id) AS value
    FROM SavedSongs ss 
    JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
    JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
    WHERE ss.email = "${user_email}"
    GROUP BY ag.genre 
    ORDER BY value DESC 
    LIMIT 100;
    `;

    console.log("User Top Genres Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getUserTotalSavedSongs = (req, res) => {
    const user_email = req.params.email;

    const query = `
    SELECT COUNT(*) AS totalSongs
    FROM SavedSongs ss
    WHERE ss.email = "${user_email}";
    `;

    console.log("User Total Saved Songs Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getUserArtistRecommendation = (req, res) => {
    const user_email = req.params.email;

    const query = `
    WITH savedsongs_genre_artist AS (
        SELECT ss.song_id, ag.genre, ats.artist_id 
        FROM SavedSongs ss 
        JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
        JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
        WHERE ss.email = "${user_email}"
    ),
    top_genres AS (
        SELECT genre, COUNT(*) AS songs_in_genre
        FROM savedsongs_genre_artist sga
        GROUP BY sga.genre
        ORDER BY songs_in_genre DESC 
        LIMIT 20
    ),
    unknown_artists AS (
        SELECT a.artist_id, a.name
        FROM Artists a
        WHERE a.artist_id NOT IN (
            SELECT DISTINCT artist_id 
            FROM savedsongs_genre_artist sga2
        )
    ),
    unknown_artists_in_top_genres AS (
        SELECT uka.artist_id, uka.name
        FROM ArtistsGenres ag2 
        JOIN top_genres tg ON tg.genre = ag2.genre
        JOIN unknown_artists uka ON uka.artist_id = ag2.artist_id
    )
    SELECT uatg.artist_id, uatg.name, AVG(s.popularity) AS artist_popularity 
    FROM unknown_artists_in_top_genres uatg
    JOIN ArtistsSongs ats3 ON ats3.artist_id = uatg.artist_id
    JOIN Songs s ON s.spotify_id = ats3.song_id 
    GROUP BY uatg.artist_id, uatg.name
    ORDER BY artist_popularity DESC 
    LIMIT 20;
    `;

    console.log("User Artist Recommendation Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getUserGenreRecommendation = (req, res) => {
    const user_email = req.params.email;

    const query = `
    WITH user_saved_songs_genres AS (
        SELECT ss.song_id, ag.genre, CEIL(s.acousticness * 10) AS mood_bucket, s.popularity 
        FROM SavedSongs ss
        JOIN ArtistsSongs ats ON ats.song_id = ss.song_id
        JOIN ArtistsGenres ag ON ag.artist_id = ats.artist_id 
        JOIN Songs s ON s.spotify_id = ats.song_id 
        WHERE ss.email = "${user_email}"
    ),
    songs_per_top_mood_bucket AS (
        SELECT ussg0.mood_bucket, COUNT(ussg0.song_id) AS num_songs
        FROM user_saved_songs_genres ussg0
        GROUP BY ussg0.mood_bucket
        ORDER BY num_songs DESC 
        LIMIT 2
    ),
    average_saved_songs_popularity AS (
        SELECT AVG(popularity) AS avg_popularity
        FROM user_saved_songs_genres
    ),
    unknown_genres AS (
        SELECT DISTINCT ag2.genre 
        FROM ArtistsGenres ag2 
        WHERE ag2.genre NOT IN (
            SELECT DISTINCT ussg.genre 
            FROM user_saved_songs_genres ussg
        )
    ),
    unknown_genre_mood_range AS (
        SELECT ug.genre, CEIL((g.acousticness) * 10) AS mood_bucket, g.popularity, g.num_songs
        FROM unknown_genres ug
        JOIN Genres g ON g.genre = ug.genre
    )
    SELECT ugmr.genre, ugmr.mood_bucket, ugmr.popularity
    FROM unknown_genre_mood_range ugmr
    JOIN songs_per_top_mood_bucket sptmb ON sptmb.mood_bucket = ugmr.mood_bucket
    JOIN average_saved_songs_popularity assp
    WHERE ugmr.popularity >= assp.avg_popularity
    ORDER BY ugmr.num_songs DESC
    LIMIT 10;
    `;

    console.log("User Genre Recommendation Query with: " + user_email);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getExactGenreSearch = (req, res) => {
    const keyword = req.params.keyword;

    const query = `
    SELECT g.genre
    FROM Genres g 
    WHERE g.genre = "${keyword}";
    `;

    console.log("Exact Genre Match with: " + keyword);
    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getPartialGenreSearch = (req, res) => {
    const keyword = req.params.keyword;

    const query = `
    SELECT g.genre
    FROM Genres g 
    WHERE g.genre LIKE "%${keyword}%"
    ORDER BY g.num_songs DESC
    LIMIT 20;
    `;

    console.log("Partial Genre Match with: " + keyword);
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
    getUserPopularityDistro: getUserPopularityDistro,
    getUserTopArtists: getUserTopArtists,
    getUserTopGenres: getUserTopGenres,
    getUserTotalSavedSongs: getUserTotalSavedSongs,
    getUserArtistRecommendation: getUserArtistRecommendation,
    getUserGenreRecommendation: getUserGenreRecommendation,
    get_song_based_on_artist: getSongBasedOnArtist,
    getExactGenreSearch: getExactGenreSearch,
    getPartialGenreSearch: getPartialGenreSearch,
};
