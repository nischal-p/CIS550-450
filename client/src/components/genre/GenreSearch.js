import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/searchPage.css";
import GenreMoodDistro from "./GenreMoodDistro";
import GenreDanceDistro from "./GenreDanceDistro";
import GenreAcousticnessDistro from "./GenreAcousticnessDistro";
import GenrePopularityDistro from "./GenrePopularityDistro";
import GenreTop10Artists from "./GenreTop10Artists";
import GenreTop10Songs from "./GenreTop10Songs";

export default class GenreSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchbox: "",
            searchResults: [],
            exactMatch: true,
            exploreGenre: "",
            selectedDiagram: "--",
            exploreGenreChanged: false,
        };
    }

    /* ---- Runs when MoodDistroDiagram loads ---- */
    componentDidMount() {
        var user_email = this.props.email;
    }

    handleChange = (e) => {
        this.setState({
            searchbox: e.target.value,
        });
    };

    handleSubmit = (e) => {
        console.log(this.state.searchbox);
        e.preventDefault();
        var queryRoute = "exactGenreSearch";
        if (!this.state.exactMatch) {
            queryRoute = "partialGenreSearch";
        }
        fetch(`http://localhost:8081/${queryRoute}/` + this.state.searchbox, {
            method: "GET", // The type of HTTP request.
        })
            .then(
                (res) => {
                    // Convert the response data to a JSON.
                    console.log(res);
                    return res.json();
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            )
            .then(
                (rows) => {
                    rows = Array.from(rows);
                    console.log(rows);
                    const genreDivs = rows.map((genre, i) => (
                        <>
                            <div
                                className="keyword"
                                id={"button-" + genre["genre"]}
                                key={"button-" + genre["genre"]}
                                onClick={() => {
                                    // being to explore the selected genre
                                    this.setState({
                                        exploreGenre: genre["genre"],
                                        exploreGenreChanged: true,
                                    });
                                }}
                            >
                                {genre["genre"]}
                            </div>
                        </>
                    ));
                    this.setState({
                        searchResults: genreDivs,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    };

    onCheck = () => {
        this.setState({
            exactMatch: !this.state.exactMatch,
        });
    };

    getGenreBubbles = () => {
        if (this.state.searchResults.length != 0) {
            return (
                <div className="keywords-container">
                    {this.state.searchResults}
                </div>
            );
        }
    };

    showExploreGenre = () => {
        if (this.state.exploreGenre === "") {
            return <div>Search for Genres, click on then and explore!</div>;
        } else if (this.state.exploreGenreChanged) {
            this.setState({
                exploreGenreChanged: false,
            });
            return (
                <div>
                    <div className="dropdown-container">
                        <select
                            value={this.state.selectedDiagram}
                            onChange={this.handleDiagramChange}
                            className="dropdown"
                            id="diagramDropdown"
                        >
                            <option value="---">---</option>
                            <option value="mood">
                                Genre Songs Distribution by Mood
                            </option>
                            <option value="dance">
                                Genre Songs Distribution by Danceability
                            </option>
                            <option value="acousticness">
                                Genre Songs Distribution by Acousticness
                            </option>
                            <option value="popularity">
                                Genre Songs Distribution by Popularity
                            </option>
                            <option value="artists">Top 10 Artists</option>
                            <option value="songs">Top 10 Songs</option>
                        </select>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="dropdown-container">
                        <select
                            value={this.state.selectedDiagram}
                            onChange={this.handleDiagramChange}
                            className="dropdown"
                            id="diagramDropdown"
                        >
                            <option value="--">---</option>
                            <option value="mood">
                                Genre Songs Distribution by Mood
                            </option>
                            <option value="dance">
                                Genre Songs Distribution by Danceability
                            </option>
                            <option value="acousticness">
                                Genre Songs Distribution by Acousticness
                            </option>
                            <option value="popularity">
                                Genre Songs Distribution by Popularity
                            </option>
                            <option value="artists">Top 10 Artists</option>
                            <option value="songs">Top 10 Songs</option>
                        </select>
                    </div>
                    <br />
                    {this.getSelectedDiagram()}
                </div>
            );
        }
    };

    getSelectedDiagram = () => {
        if (this.state.selectedDiagram === "mood") {
            return <GenreMoodDistro genre={this.state.exploreGenre} />;
        } else if (this.state.selectedDiagram === "dance") {
            return <GenreDanceDistro genre={this.state.exploreGenre} />;
        } else if (this.state.selectedDiagram === "acousticness") {
            return <GenreAcousticnessDistro genre={this.state.exploreGenre} />;
        } else if (this.state.selectedDiagram === "popularity") {
            return <GenrePopularityDistro genre={this.state.exploreGenre} />;
        } else if (this.state.selectedDiagram === "artists") {
            return <GenreTop10Artists genre={this.state.exploreGenre} />;
        } else if (this.state.selectedDiagram === "songs") {
            return <GenreTop10Songs genre={this.state.exploreGenre} />;
        }
    };

    handleDiagramChange = (e) => {
        this.setState({
            selectedDiagram: e.target.value,
        });
    };

    render() {
        return (
            <div>
                <form className="search-bar" onSubmit={this.handleSubmit}>
                    <input
                        className="search-input"
                        placeholder={"Search for genres"}
                        onChange={this.handleChange}
                    />
                    <div class="artists-tracks">
                        <label class="checkbox-label">
                            <span>Exact Match</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    onChange={this.onCheck}
                                />
                                <span class="slider round"></span>
                            </label>
                            <span>Partial Match</span>
                        </label>
                    </div>
                </form>
                <br />
                <div className="jumbotron">{this.getGenreBubbles()}</div>
                <hr />
                <h4>Explore Genres: {this.state.exploreGenre}</h4>
                <br />
                {this.showExploreGenre()}
            </div>
        );
    }
}
