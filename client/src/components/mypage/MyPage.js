import React from "react";
import PageNavbar from "../pagenavbar/PageNavbar";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";

export default class BestMovies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moodDistroData: [],
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MyPage loads ---- */
    componentDidMount() {
        var user_email = "aoconnell@pfeffer.com";
        fetch("http://localhost:8081/userMoodDistro/" + user_email, {
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
                (rows) => {
                    console.log(rows);
                    rows.forEach((element) => {
                        element["xlabel"] = `${element["mood_bucket"]} - ${
                            element["mood_bucket"] + 1
                        }`;
                    });
                    this.setState({
                        moodDistroData: rows,
                    });
                },
                (err) => {
                    // Print the error if there is one.
                    console.log(err);
                }
            );
    }

    getBucketLables = (data) => {
        return data.Array.map((element) => {
            return `${element["mood_bucket"]} - ${element["mood_bucket"] + 1}`;
        });
    };

    render() {
        return (
            <div className="MyPage">
                <PageNavbar active="mypage" />
                <div>
                    <h5>Welcome user: aoconnell@pfeffer.com</h5>

                    <ResponsiveContainer width="80%" height={400}>
                        <AreaChart data={this.state.moodDistroData}>
                            <Area dataKey="num_songs" />
                            <XAxis dataKey="mood_bucket" />

                            <YAxis dataKey="num_songs" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}
