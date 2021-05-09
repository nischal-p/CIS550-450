import React from "react";
import "../../style/MyPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default class PopularityDistroDiagram extends React.Component {
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
        fetch("http://3.236.236.128:8081/userPopularityDistro/" + user_email, {
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
                    rows = Array.from(rows);
                    console.log(rows);
                    console.log(rows.type);
                    rows.forEach((element) => {
                        if (element["acousticness_bucket"] !== 0) {
                            element["xlabel"] = `${
                                element["popularity_bucket"] - 1
                            } - ${element["popularity_bucket"]}`;
                        } else {
                            element["xlabel"] = "";
                        }
                    });
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
                <p>
                    Number of saved songs per different Acousticness buckets (0
                    is least acoustic, 10 is most acoustic)
                </p>

                <div className="jumbotron">
                    <ResponsiveContainer width="80%" height={400}>
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
                            <XAxis type="category" dataKey="xlabel" />
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
