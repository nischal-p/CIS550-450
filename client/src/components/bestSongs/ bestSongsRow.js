import React from 'react'
import '../../style/searchResultsRow.css'

const BestSongsResultsRow = ( props ) => {
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
					<div className="song-popularity">
						<span>Hi</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BestSongsResultsRow;