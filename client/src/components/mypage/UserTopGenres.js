import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactWordcloud from "react-wordcloud";

export default class UserTopGenres extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            distroData: [],
            options: {
                fontSizes: [12, 60],
                fontWeight: "bold",
                fontFamily: "Poppins",
            },
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MoodDistroDiagram loads ---- */
    componentDidMount() {
        var user_email = this.props.email;
        fetch("http://localhost:8081/userTopGenres/" + user_email, {
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
                        distroData: rows,
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
            <>
                <p>Top Genres</p>
                <div className="jumbotron container-fluid">
                    <ReactWordcloud
                        words={this.state.distroData}
                        options={this.state.options}
                    />
                </div>
                <hr />
            </>
        );
    }
}
