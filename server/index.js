const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

// input routes for application
app.post("/check_login", routes.check_login);

// routes for creating user
app.post("/create_user", routes.user_signup);

//Acount Page
app.get("/account/:sessionID", routes.getAccountPage);

//Search Page
app.get("/search/:song_title", routes.getSongFromDB);

app.get("/search/artist/:artist_name", routes.get_song_based_on_artist);

//Recommendation Page
app.get("/recommendation/:song_title&:user_email", routes.getSongRec);

app.get("/recommendation/artist/:artist_name", routes.getSongRecBasedOnArtist);


// BestSongs Page
app.get('/decades', routes.get_decades)

app.get('/genres', routes.get_genres)

app.get('/bestsongs/:decade/:genre', routes.get_best_songs)

//My Page
app.get("/userMoodDistro/:email", routes.getUserMoodDistro);

//My Page
app.get("/userDancebilityDistro/:email", routes.getUserDanceabilityDistro);

//My Page
app.get("/userAcousticnessDistro/:email", routes.getUserAcousticnessDistro);

//My Page
app.get("/userPopularityDistro/:email", routes.getUserPopularityDistro);

//My Page
app.get("/userTopArtists/:email", routes.getUserTopArtists);

//My Page
app.get("/userTopGenres/:email", routes.getUserTopGenres);

//My Page
app.get("/totalSavedSongs/:email", routes.getUserTotalSavedSongs);

//My Page
app.get("/userGenreRecommendation/:email", routes.getUserGenreRecommendation);

//My Page
app.get("/userArtistRecommendation/:email", routes.getUserArtistRecommendation);

//My Page
app.get("/exactGenreSearch/:keyword", routes.getExactGenreSearch);

//My Page
app.get("/partialGenreSearch/:keyword", routes.getPartialGenreSearch);

//My Page
app.get("/genreMoodDistro/:genre", routes.getGenreMoodDistro);

app.get("/genreAcousticnessDistro/:genre", routes.getGenreAcousticnessDistro);

app.get("/genrePopularityDistro/:genre", routes.getGenrePopularityDistro);

app.get("/genreDanceabilityDistro/:genre", routes.getGenreDancabilityDistro);

app.get("/genreTopArtists/:genre", routes.getGenreTopArtists);

app.get("/genreTopSongs/:genre", routes.getGenreTopSongs);

app.listen(8081, () => {
    console.log(`Server listening on PORT 8081`);
});
