const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

// input routes for application
app.post('/check_login', routes.check_login)

//Acount Page
app.get('/account/:sessionID', routes.getAccountPage);


//Search Page
app.get('/searchPage/:song_title', routes.getSongFromDB);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
