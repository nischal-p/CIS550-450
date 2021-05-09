import React, { useState, useEffect } from 'react';
import '../../style/searchResultsRow.css'
import { PieChart, Pie, Tooltip, Cell } from "recharts";



const SearchResultsRow = ( props ) => {
	// grab data for piechart from props
	const data = [
		{name : 'popularity' , value : props.popularity},
		{name : 'danceability', value : Math.ceil(props.danceability * 100)},
		{name : 'mood', value : Math.ceil(props.mood * 100)}
	]

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

	const [isSaved, setIsSaved] = useState(props.saved)
	console.log(props.saved)

	const [save, setSave] = useState('')

	const onPress = () => {

		// make post request to database to insert song in saved songs
		fetch('http://localhost:8081/save_song', {
			method : 'post',
			headers: { "Content-Type": "application/json" },
			body : JSON.stringify({'song_id' : props.song_id, 'email' : localStorage.getItem('username')})
		}).then((response) => response.json())
		.then(res => {
			console.log(res)

			setIsSaved(true)

			if (!res) {
				setSave("Song Saved")
			}
		})
	}
	
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
						{!isSaved ? 
						<button className="add-songs" onClick={onPress}>Save Song</button> : 
						<div style={{color : 'green', marginTop: 10}}>{save}</div>}
					</div>
					<PieChart width={200} height={200}>
						<Pie
							data={data}
							cx={100}
							cy={100}
							innerRadius={40}
							outerRadius={60}
							fill="#8884d8"
							paddingAngle={5}
							dataKey="value"
							isAnimationActive={false}
						>
							{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</div>
			</div>
		</div>
	)
}

export default SearchResultsRow;
