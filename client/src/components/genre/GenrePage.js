import React from "react";
import PageNavbar from "../pagenavbar/PageNavbar";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MoodDistroDiagram from "../mypage/MoodDistroDiagram";
import DanceabilityDistroDiagram from "../mypage/DancebilityDistroDiagram";
import AcousticnessDistroDiagram from "../mypage/AcousticnessDistroDiagram";
import UserTop10Artists from "../mypage/UserTop10Artists";
import UserTopGenres from "../mypage/UserTopGenres";
import GenreSearch from "./GenreSearch";

export default class GenrePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalSavedSongs: 0,
            selectedDiagram: "mood",
            selectedDiagramCode: <div class="jumpotron"></div>,
            email: localStorage.getItem("username"),
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MyPage loads ---- */
    componentDidMount() {
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
        var user_email = this.state.email;
        if (this.state.selectedDiagram === "mood") {
            return <MoodDistroDiagram email={user_email} />;
        } else if (this.state.selectedDiagram === "dance") {
            return <DanceabilityDistroDiagram email={user_email} />;
        } else if (this.state.selectedDiagram === "acousticness") {
            return <AcousticnessDistroDiagram email={user_email} />;
        } else if (this.state.selectedDiagram === "artists") {
            return <UserTop10Artists email={user_email} />;
        } else if (this.state.selectedDiagram === "genres") {
            return <UserTopGenres email={user_email} />;
        }
    };

    render() {
        return (
            <div className="MyPage">
                <PageNavbar active="genres" />
                <div className="container pt-3">
                    <GenreSearch />
                </div>
            </div>
        );
    }
}
