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
                    rows = Array.from(rows)
                    console.log(rows);
                    console.log(rows.type)
                    rows.forEach(element => {
                        if (element["mood_bucket"] != 0) {
                            element["xlabel"] = `${element["mood_bucket"] - 1} - ${element["mood_bucket"]}`;
                        } else {
                            element["xlabel"] = ""
                        }
                        
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
                <div className="container pt-3">
                    <h5>Welcome aoconnell@pfeffer.com</h5>
                    <hr/>
                    <p>Distribution of Songs per different mood buckets (0 is least happy/upbeat, 10 is most happy/upbeat)</p>
                    <ResponsiveContainer width="80%" height={400}>
                        <AreaChart data={this.state.moodDistroData}>
                        <defs>
                            <linearGradient id="colorUv" x1="1" y1="1" x2="0" y2="0">
                                <stop offset="5%" stopColor="#84c8b1" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.7}/>
                            </linearGradient>
                        </defs>
                            <Area dataKey="num_songs"  fill="url(#colorUv)"/>
                            <XAxis type="category" dataKey="xlabel" />
                            <YAxis dataKey="num_songs" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                        </AreaChart>
                    </ResponsiveContainer>
                    <hr/>
                </div>
            </div>
        );
    }
}
