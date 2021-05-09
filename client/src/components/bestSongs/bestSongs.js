import React, { useState, useEffect } from 'react';

import PageNavbar from '../pagenavbar/PageNavbar'
import '../../style/bestSongs.css'
import BestSongsRow from './ bestSongsRow'


const BestSongs = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        selectedDecade : '',
        selectedGenre : ''
    })

    const [genres, setGenres] = useState([])

    const [decades, setDecades] = useState([])

    const [bestSongs, setBestSongs] = useState([])


    const handleDecadeChange = event => {
        setSelectedOptions({...selectedOptions, selectedDecade : event.target.value})
    }

    const handleGenreChange = event => {
        setSelectedOptions({...selectedOptions, selectedGenre : event.target.value})
    }

    const handleSubmit = event => {
        event.preventDefault()

        var decade = selectedOptions.selectedDecade;
        var genre = selectedOptions.selectedGenre;

        fetch('http://localhost:8081/bestsongs/' + decade + '/' + genre, {
            method : 'get',
            headers : {'Content-Type':'application/json'}
        }).then((response) => response.json())
        .then(res => {
            console.log(res)

            setBestSongs(res)
        })
    }

    // get decades for dropdown from list
    useEffect(() => {
        fetch('http://localhost:8081/decades', {
            method : 'get',
            headers : {'Content-Type':'application/json'}
        }).then((response) => response.json())
        .then(res => {

            // assemble result
            var result = []
            for (var i = 0; i < res.length; i++) {
                result.push(res[i].decade)
            }

            // set decades dropdown
            setDecades(result)

            // set initial state
            setSelectedOptions({...selectedOptions, selectedDecade : result[0]})

        })
    }, [])


    // get most popular genres from list
    useEffect(() => {
        fetch('http://localhost:8081/genres', {
            method : 'get',
            headers : {'Content-Type':'application/json'}
        }).then((response) => response.json())
        .then(res => {
            console.log(res)

            // assemble result
            var result = []
            for (var i = 0; i < res.length; i++) {
                result.push(res[i].genre)
            }

            // set genres
            setGenres(result)

            // set initial state
            setSelectedOptions({...selectedOptions, selectedGenre : result[0]})

        })
    }, [])

    
    return (
        <div className="BestSongs">
				<PageNavbar active="best songs" />
				<div className="container bestmovies-container">
					<div className="best-songs">
						<div className="h5">Best Songs</div>
						<div className="dropdown-container">
							<select value={selectedOptions.selectedDecade} onChange={handleDecadeChange} className="dropdown" id="decadesDropdown">
								{decades.map((decadeObj, index) => {
                                    return <option 
                                    className="decadesOption"
                                    value={decadeObj}
                                    key={index}>
                                    {decadeObj}
                                    </option>
                                })}
							</select>
							<select value={selectedOptions.selectedGenre} onChange={handleGenreChange} className="dropdown" id="genresDropdown">
								{genres.map((genreObj, index) => {
                                    return <option 
                                    className="genresOption"
                                    value={genreObj}
                                    key={index}>
                                        {genreObj}
                                    </option>
                                })}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={handleSubmit}>Submit</button>
						</div>
			        </div>
                    <div className="results-container" id="results">
						<div className="best-songs-title">
							<h3>Tracklist</h3>
							<div class="total-tracks">
								<span>{bestSongs.length} Tracks</span>
							</div>
						</div>
                        {bestSongs.length > 0 ?
                            bestSongs.map((obj, idx) => {
                                return <BestSongsRow 
                                key={idx} 
                                title={obj.song_name} 
                                link={obj.link}
                                artist={obj.artist_name}
                                img={obj.img_src}
                                popularity={obj.popularity}
                                acousticness={obj.acousticness}
                                danceability={obj.danceability}
                                />
                            }) : 
                            <div style={{marginTop : 15}}>No Results</div>}
					</div>
			    </div>
			  </div>
    )
}


export default BestSongs;