import React from 'react'
import LegendItem from './legenditem.jsx'

class PieLegend extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		var toRender = []
		var data = this.props.dataSet;
		for(var i = 0; i<data.length; i++) toRender.push(<LegendItem backgroundColor={data[i].color} label={data[i].long}/>);
		return (
			<div>
			{
				this.props.dataSet.map(function(legenditem, i){
					return(
						<LegendItem backgroundColor={legenditem.color} label={legenditem.long} key={i}/>
					)
				})
			}
			</div>
		)
	}
}

export default PieLegend