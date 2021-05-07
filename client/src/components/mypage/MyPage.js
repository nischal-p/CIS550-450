import React from "react";
import PageNavbar from "../pagenavbar/PageNavbar";
import "../style/BestMovies.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class BestMovies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDecade: "",
            selectedGenre: "",
            decades: [],
            genres: [],
            movies: [],
        };

        this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
        this.handleDecadeChange = this.handleDecadeChange.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
    }

    /* ---- Q3a (Best Movies) ---- */
    componentDidMount() {
        // fetching decades
        fetch("http://localhost:8081/decades", {
            method: "GET",
        })
            .then(
                (res) => {
                    // Convert the response data to a JSON.
                    return res.json();
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            )
            .then(
                (decadeList) => {
                    if (!decadeList) return;

                    const allDecades = decadeList.map((decadeObject) => (
                        <option className="decadesOption" value={decadeObject.decade}>
                            {decadeObject.decade}
                        </option>
                    ));

                    this.setState({
                        selectedDecade: decadeList[0]["decade"],
                    });

                    this.setState({
                        decades: allDecades,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );

        // fetching genres
        fetch("http://localhost:8081/genres", {
            method: "GET", // The type of HTTP request.
        })
            .then(
                (res) => {
                    // Convert the response data to a JSON.
                    return res.json();
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            )
            .then(
                (genreList) => {
                    if (!genreList) return;

                    const allGenres = genreList.map((genreObject) => (
                        <option className="genresOption" value={genreObject.name}>
                            {genreObject.name}
                        </option>
                    ));

                    this.setState({
                        selectedGenre: genreList[0]["name"],
                    });

                    this.setState({
                        genres: allGenres,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    }

    /* ---- Q3a (Best Movies) ---- */
    handleDecadeChange(e) {
        this.setState({
            selectedDecade: e.target.value,
        });
    }

    handleGenreChange(e) {
        this.setState({
            selectedGenre: e.target.value,
        });
    }

    /* ---- Q3b (Best Movies) ---- */
    submitDecadeGenre() {
        const query_param = {
            decade: this.state.selectedDecade,
            genre: this.state.selectedGenre,
        };
        console.log(query_param);

        fetch("http://localhost:8081/bestmoviesresults", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(query_param),
        })
            .then(
                (res) => {
                    // Convert the response data to a JSON.
                    return res.json();
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            )
            .then(
                (movieList) => {
                    if (!movieList) return;

                    const movieDivs = movieList.map((movieObj, i) => (
                        <BestMoviesRow
                            id={movieObj.movie_id}
                            title={movieObj.title}
                            rating={movieObj.rating}
                        />
                    ));

                    // Set the state of the keywords list to the value returned by the HTTP response from the server.
                    this.setState({
                        movies: movieDivs,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    }

    render() {
        return (
            <div className="BestMovies">
                <PageNavbar active="bestgenres" />

                <div className="container bestmovies-container">
                    <div className="jumbotron">
                        <div className="h5">Best Movies</div>
                        <div className="dropdown-container">
                            <select
                                value={this.state.selectedDecade}
                                onChange={this.handleDecadeChange}
                                className="dropdown"
                                id="decadesDropdown"
                            >
                                {this.state.decades}
                            </select>
                            <select
                                value={this.state.selectedGenre}
                                onChange={this.handleGenreChange}
                                className="dropdown"
                                id="genresDropdown"
                            >
                                {this.state.genres}
                            </select>
                            <button
                                className="submit-btn"
                                id="submitBtn"
                                onClick={this.submitDecadeGenre}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <div className="jumbotron">
                        <div className="movies-container">
                            <div className="movie">
                                <div className="header">
                                    <strong>Title</strong>
                                </div>
                                <div className="header">
                                    <strong>Movie ID</strong>
                                </div>
                                <div className="header">
                                    <strong>Rating</strong>
                                </div>
                            </div>
                            <div className="movies-container" id="results">
                                {this.state.movies}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
