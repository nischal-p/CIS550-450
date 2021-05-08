import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/searchPage.css";

export default class GenreSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchbox: "",
            searchResults: [],
            exactMatch: true,
            exploreGenre: "",
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
                                    // copy artist name to clipboard on click
                                    this.setState({
                                        exploreGenre: genre["genre"],
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
        } else {
            return <div>Actual Stuff is coming in!</div>;
        }
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
                <h4>Explore Genres</h4>
                {this.showExploreGenre()}
            </div>
        );
    }
}
