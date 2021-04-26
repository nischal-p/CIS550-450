import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Login from '../components/login/Login'
import Signup from '../components/signup/Signup'


export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Login />}
						/>
					</Switch>
					<Switch>
					<Route
							exact
							path="/signup"
							render={() => <Signup />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};