import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class ArtistRecComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendationData: [],
            recommendations: [],
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MoodDistroDiagram loads ---- */
    componentDidMount() {
        var user_email = this.props.email;
        fetch("http://3.236.236.128:8081/userArtistRecommendation/" + user_email, {
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
                        recommendationData: rows,
                    });
                    const artistRecDivs = rows.map((artistRec, i) => (
                        <>
                            <div
                                className="keyword"
                                id={"button-" + artistRec["artist_id"]}
                                key={"button-" + artistRec["artist_id"]}
                                onClick={() => {
                                    // copy artist name to clipboard on click
                                    navigator.clipboard.writeText(
                                        artistRec["name"]
                                    );
                                }}
                            >
                                {artistRec["name"]}
                            </div>
                        </>
                    ));
                    this.setState({
                        recommendations: artistRecDivs,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    }

    getArtistRecommendationComponent = () => {
        if (this.state.recommendations.length === 0) {
            return (
                <span>
                    <img
                        src="http://i.stack.imgur.com/FhHRx.gif"
                        alt="loading gif"
                    />
                </span>
            );
        } else {
            return (
                <div className="jumbotron">
                    <div className="keywords-container">
                        {this.state.recommendations}
                    </div>
                </div>
            );
        }
    };

    render() {
        return (
            <>
                <div>
                    <h4>Artist Recommendation</h4>
                    Based on your saved songs, we recommend the following
                    artists:
                    {this.getArtistRecommendationComponent()}
                </div>
            </>
        );
    }
}
