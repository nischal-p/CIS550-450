import React from 'react';
import '../../style/searchResultsRow.css'
import { PieChart, Pie, Tooltip, Cell } from "recharts";



const SearchResultsRow = ( props ) => {
	const data = [
		{name : 'popularity' , value : props.popularity},
		{name : 'danceability', value : Math.ceil(props.danceability * 100)},
		{name : 'mood', value : Math.ceil(props.mood * 100)}
	]

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
	
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
