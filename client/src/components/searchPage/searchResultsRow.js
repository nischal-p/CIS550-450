import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchResultsRow extends React.Component {

	render() {
		return (
			<div className="searchResults">
				<div className="title">{this.props.title}</div>
				<div className="artist">{this.props.artist}</div>
				<div className="mood">{this.props.mood}</div>
				<div className="release_year">{this.props.release_year}</div>
                <div className="popularity">{this.props.popularity}</div>
			</div>
		);
	};
};
