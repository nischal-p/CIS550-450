import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class GenreRecComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            genreRecommendation: [],
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MoodDistroDiagram loads ---- */
    componentDidMount() {
        var user_email = this.props.email;
        fetch("http://localhost:8081/userGenreRecommendation/" + user_email, {
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
                    this.setState({
                        artistRecommendation: rows,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    }

    getGenreRecommendationComponent = () => {
        if (this.state.genreRecommendation.length === 0) {
            return (
                <span>
                    <img
                        src="http://i.stack.imgur.com/FhHRx.gif"
                        alt="loading gif"
                    />
                </span>
            );
        } else {
            return <div>Genre recommendations are available</div>;
        }
    };

    render() {
        return (
            <>
                <div>
                    {" "}
                    Based on your artists history, we recommend the following
                    artists:
                    {this.getArtistRecommendationComponent()}
                </div>
            </>
        );
    }
}
