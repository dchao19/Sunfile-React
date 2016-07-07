import React from 'react'
import Rectangle from 'react-rectangle'

class LegendItem extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div style={{display: "flex", marginBottom: "7px"}}>
				<span> <div style={{ background: this.props.backgroundColor, width: "20px", height: "20px", alignSelf: "center"}}/> </span>
				<span style={{marginLeft: "10px"}}>{this.props.label}</span>
			</div>
		)
	}
}

export default LegendItem