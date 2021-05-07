import React, { useState } from 'react';
import SearchResultsRow from './searchResultsRow';
import '../../style/searchPage.css';

const SearchPage = () => {
	
	const [artistOrTrack, setArtistOrTrack] = useState("Search by Track")

    const [searchParameter, setSearchParameter] = useState('');

	// state for results 
	const [results, setResults] = useState([])

    const handleChange = event => {
        setSearchParameter(event.target.value)
    }

	const handleSubmit = event => {
		event.preventDefault();

		fetch('http://localhost:8081/search/' + searchParameter, {
			method : 'get', 
			headers : {'Content-Type':'application/json'}
		}).then((response) => response.json())
		.then(res => {
			setResults(res)

			console.log(res)
		})
	}


	return (
		<div className="search-page">
			<div className="container SearchResults-container">
				<div>Navbar</div>
				<div>
					<h1 class="search-text">Search for your favorite song. </h1>
					<form className='search-bar' onSubmit={handleSubmit}>
						<input className="search-input" 
						placeholder={artistOrTrack} 
						onChange={handleChange}/> 
						<div class="artists-tracks">
							<label class="checkbox-label">
								<span>Tracks</span>
								<div class="switch-box">
									<input type="checkbox" />
									<span class="checkbox-span"></span>
								</div>
								<span>Artists</span>
							</label>
						</div>
					</form>
					<div className="results-container" id="results">
						<div className="results-title">
							<h3>Tracklist</h3>
							<div class="total-tracks">
								<span>{results.length} Tracks</span>
							</div>
						</div>
						{results.map((obj, idx) => {
							return <SearchResultsRow 
							key={idx} 
							title={obj.song_name} 
							link={obj.link}
							artist={obj.artist_name}
							img={obj.img_src}
							duration={obj.duration}
							/>
						})}
					</div>
				</div>
			</div>
		</div>
	);
}


export default SearchPage;