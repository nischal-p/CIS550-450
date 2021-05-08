const config = require('./db-config.js')
const mysql = require('mysql')
var request = require('request')

config.connectionLimit = 10
const connection = mysql.createPool(config)


// for password hashing
var crypto = require('crypto');


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


const checkLogin = (req, res) => {
    // grab username, password from the frontend form
    var username = req.body.email;
    var password = req.body.password;

    // compute hashed password
    var hashed_password = crypto.createHash("sha256").update(password).digest("hex");

    // query database to check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${username}' AND password = '${hashed_password}'`

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err)
        else {
            console.log(rows)
            if (rows.length == 1) res.send(true)
            else res.send(false)
        }
    })
}


const userSignup = (req, res) => {
    // grab username, password from frontend form
    var username = req.body.email;
    var password = req.body.password

    // hash password
  var hashed_password = crypto.createHash("sha256").update(password).digest("hex");
	console.log("hashed Password: ", hashed_password);

    // make call to check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${username}' AND password = '${hashed_password}'`

    connection.query(query, (err, rows, fields) => {
        if (err) console.log(err)
        else {
            console.log(rows)
            console.log("check user called!")

            if (rows.length == 0) {
                // insert into database with username, hashed password
                const insert_query = `INSERT INTO Users (email, password) VALUES ('${username}', '${hashed_password}')`
                connection.query(insert_query, (err, rows, fields) => {
                    if (err) throw err
                    else {
                        console.log("Success! User with email " + username  + " inserted!")

                        res.send(true)
                    }
                })
            } else {
                console.log("User already exists")
            }
        }
    })
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

const getSongFromDB = (req, res) => {
  const song_name = req.params.song_title

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
      var client_id = '8eab0cca59954ff8b78151cbc3b7c2ea';
      var client_secret = 'a2119aead89a4308876d6385ee0a5263';

      // your application requests authorization from spotify
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) { 
          

          // instantiate result array
          var result = []
          for (var i = 0; i < rows.length; i++) {

            // query spotify api with target id
            var options = {
              url: 'https://api.spotify.com/v1/tracks/' + rows[i].spotify_id, 
              headers : {'Authorization' : 'Bearer ' + body.access_token},
              json : true
            }

            // assemble result array to pass to frontend component
            request.get(options, function(err, response, body) {
               console.log(body)
               result.push({artist_name : body['artists'][0]['name'], song_name: body['name'], 
               img_src: body['album']['images'][1]['url'], duration: body['duration_ms'],
               link : body['external_urls']['spotify']})

               // pass final result to frontend
               if (result.length == rows.length) {
                 res.json(result)
               }
            })
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
  LIMIT 10`

  console.log("Sent query with " + artist_name)
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else {
      console.log("Got Response:" + JSON.stringify(rows)); 

      // query spotify API for songs
      var client_id = '8eab0cca59954ff8b78151cbc3b7c2ea';
      var client_secret = 'a2119aead89a4308876d6385ee0a5263';

      // your application requests authorization from spotify
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) { 
          

          // instantiate result array
          var result = []
          for (var i = 0; i < rows.length; i++) {

            // query spotify api with target id
            var options = {
              url: 'https://api.spotify.com/v1/tracks/' + rows[i].spotify_id, 
              headers : {'Authorization' : 'Bearer ' + body.access_token},
              json : true
            }

            // assemble result array to pass to frontend component
            request.get(options, function(err, response, body) {
               result.push({artist_name : body['artists'][0]['name'], song_name: body['name'], 
               img_src: body['album']['images'][1]['url'], duration: body['duration_ms'],
               link : body['external_urls']['spotify']})

               // pass final result to frontend
               if (result.length == rows.length) {
                 res.json(result)
               }
            })
          }
        }
      });
    }
  })


}



module.exports = {
    check_login : checkLogin,
    user_signup : userSignup,
    getAccountPage : getAccountPage,
    getSongFromDB : getSongFromDB,
    get_song_based_on_artist : getSongBasedOnArtist
}