import React from 'react';
import SearchResultsRow from './searchResultsRow';
import '../../style/searchPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchPage extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
		this.state = {
			songName: "",
			searchResults: []
		};

		this.handleSongNameChange = this.handleSongNameChange.bind(this);
		this.submitSong = this.submitSong.bind(this);
	};

	handleSongNameChange(e) {
		this.setState({
			songName: e.target.value

		});

	};

	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitSong() {
        // Send an HTTP request to the server.
        console.log(this.state.songName);
        fetch("http://localhost:8081/searchPage/" + this.state.songName,
        {
          method: 'GET' // The type of HTTP request.
        }).then(res => {
          // Convert the response data to a JSON.
          return res.json();
        }, err => {
          // Print the error if there is one.
          console.log(err);
      }).then(resultList => {
          if (!resultList) return;
          console.log(resultList);
          const songDivs = resultList.map((songObj, i) =>
            <SearchResultsRow
              title={songObj.title}
              artist={songObj.artist}
              mood={songObj.mood}
              release_year={songObj.release_year}
              popularity={songObj.popularity}
            />
          );

          this.setState({
            searchResults: songDivs
          });

        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
	};


	render() {
		return (
			<div className="Search Page">
				<div className="container SearchResults-container">
					<div className="jumbotron">
						<div className="h5">Search</div>
						<br></br>
						<div className="input-container">
							<input type='text' placeholder="Enter Song Name" value={this.state.songName} onChange={this.handleSongNameChange} id="songName" className="song-input"/>
							<button id="submitSongBtn" className="submit-btn" onClick={this.submitSong}>Submit</button>
						</div>
						<div className="header-container">
							<div className="h6">Our best results ...</div>
							<div className="headers">
								<div className="header"><strong>Title</strong></div>
								<div className="header"><strong>Artist</strong></div>
								<div className="header"><strong>Mood</strong></div>
								<div className="header"><strong>Release Year</strong></div>
                                <div className="header"><strong>Popularity</strong></div>
							</div>
						</div>
						<div className="results-container" id="results">
							{this.state.searchResults}
						</div>
					</div>
				</div>
			</div>
		);
	};
};
