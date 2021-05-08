import React from "react";
import PageNavbar from "../pagenavbar/PageNavbar";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MoodDistroDiagram from "./MoodDistroDiagram";
import DanceabilityDistroDiagram from "./DancebilityDistroDiagram";
import AcousticnessDistroDiagram from "./AcousticnessDistroDiagram";
import UserTop10Artists from "./UserTop10Artists";
import UserTopGenres from "./UserTopGenres";
import ArtistRecComp from "./ArtistRecComp";

export default class MyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalSavedSongs: 0,
            selectedDiagram: "mood",
            selectedDiagramCode: <div class="jumpotron"></div>,
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MyPage loads ---- */
    componentDidMount() {
        var user_email = "aoconnell@pfeffer.com";
        fetch("http://localhost:8081/totalSavedSongs/" + user_email, {
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
                        totalSavedSongs: rows[0]["totalSongs"],
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );

        this.setState({
            selectedDiagram: "mood",
        });
    }

    handleDiagramChange = (e) => {
        this.setState({
            selectedDiagram: e.target.value,
        });
    };

    getSelectedDiagram = () => {
        if (this.state.selectedDiagram === "mood") {
            return <MoodDistroDiagram email="aoconnell@pfeffer.com" />;
        } else if (this.state.selectedDiagram === "dance") {
            return <DanceabilityDistroDiagram email="aoconnell@pfeffer.com" />;
        } else if (this.state.selectedDiagram === "acousticness") {
            return <AcousticnessDistroDiagram email="aoconnell@pfeffer.com" />;
        } else if (this.state.selectedDiagram === "artists") {
            return <UserTop10Artists email="aoconnell@pfeffer.com" />;
        } else if (this.state.selectedDiagram === "genres") {
            return <UserTopGenres email="aoconnell@pfeffer.com" />;
        }
    };

    render() {
        return (
            <div className="MyPage">
                <PageNavbar active="mypage" />
                <div className="container pt-3">
                    <h5>Discover saved songs by aoconnell@pfeffer.com</h5>
                    <p>
                        You have {this.state.totalSavedSongs} saved songs in
                        total.
                    </p>
                    <hr />
                    <div className="dropdown-container">
                        <select
                            value={this.state.selectedDiagram}
                            onChange={this.handleDiagramChange}
                            className="dropdown"
                            id="diagramDropdown"
                        >
                            <option value="mood">
                                Saved Songs Distribution by Mood
                            </option>
                            <option value="dance">
                                Saved Songs Distribution by Danceability
                            </option>
                            <option value="acousticness">
                                Saved Songs Distribution by Acousticness
                            </option>
                            <option value="artists">Top 10 Artists</option>
                            <option value="genres">Top 10 Genres</option>
                        </select>
                    </div>
                    <br />
                    {this.getSelectedDiagram()}
                    <hr />

                    <ArtistRecComp email="aoconnell@pfeffer.com" />
                </div>
            </div>
        );
    }
}
