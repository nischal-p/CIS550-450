import React from 'react';
import '../../style/searchResultsRow.css'

const convertToTime = ms_time => {
	var minutes = Math.floor(ms_time / 60000);
	var seconds = ((ms_time % 60000) / 1000).toFixed(0);
  	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const RecommendationsResultsRow = ( props ) => {
	return (
		<div>
			<div className="parent-link">
				<div className="song-row">
					<div className="album-art">
						<a href={props.link} target="_blank">
							<img className="album-image" src={props.img}/>
						</a>
					</div>
					<div className="song-caption">
						<b className="song-title">{props.title}</b>
						<ul aria-label="Artist" class="song-artists">
							{props.artist}
						</ul>
					</div>
					<div className="song-duration">
						<span>{convertToTime(props.duration)}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RecommendationsResultsRow;
