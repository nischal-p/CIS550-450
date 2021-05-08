import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";
import SearchPage from "../components/searchPage/searchPage";
import MyPage from "../components/mypage/MyPage";
import GenrePage from "../components/genre/GenrePage";
import RecommendationsPage from "../components/recommendations/recommendationsPage";
import ArtistsPage from '../components/artistspage/ArtistsPage'
import BestSongs from '../components/bestSongs/bestSongs'

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => <Login />} />
                    </Switch>
                    <Switch>
                        <Route exact path="/signup" render={() => <Signup />} />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path="/search"
                            render={() => <SearchPage />}
                        />
                    </Switch>
                    <Switch>
                        <Route exact path="/mypage" render={() => <MyPage />} />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path="/genres"
                            render={() => <GenrePage />}
                        />
                    </Switch>
                    <Switch>
                        <Route
                            exact
                            path="/recommendations"
                            render={() => <RecommendationsPage />}
                        />
                    </Switch>
                    <Switch>
                        <Route
                                exact
                                path="/artistspage"
                                render={() => <ArtistsPage />}
                            />
                    </Switch>
                    <Switch>
                        <Route
                                exact
                                path="/best songs"
                                render={() => <BestSongs />}
                            />
                    </Switch>
                </Router>
            </div>
        );
    }
}