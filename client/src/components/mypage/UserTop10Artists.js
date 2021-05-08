import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Bar,
    BarChart,
} from "recharts";

export default class UserTop10Artists extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            distroData: [],
        };

        // this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
    }

    /* ---- Runs when MoodDistroDiagram loads ---- */
    componentDidMount() {
        var user_email = this.props.email;

        fetch("http://localhost:8081/userTopArtists/" + user_email, {
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
                <p>Number of saved songs from top 10 Artists</p>

                <div className="jumbotron">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={this.state.distroData}>
                            <defs>
                                <linearGradient
                                    id="colorUv"
                                    x1="1"
                                    y1="1"
                                    x2="0"
                                    y2="0"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#84c8b1"
                                        stopOpacity={0.7}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#8884d8"
                                        stopOpacity={0.7}
                                    />
                                </linearGradient>
                            </defs>
                            <Bar dataKey="num_songs" fill="url(#colorUv)" />
                            <XAxis
                                type="category"
                                dataKey="name"
                                tickCount="10"
                            />
                            <YAxis dataKey="num_songs" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <hr />
            </>
        );
    }
}
