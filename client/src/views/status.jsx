export default React.createClass({
	render() {
		function formatDate(time) {
			return time ? (new Date(time)).toString() : '';
		}

		return (
			<div>
				<div className='status_container'>
					<div className='status_label'>Server Time:</div>
					<div className='status_value'>{formatDate(this.props.time)}</div>
				</div>
				<div className='status_container'>
					<div className='status_label'>Lighting State:</div>
					<div className='status_value'>{this.props.state}</div>
				</div>
				<div className='status_container'>
					<div className='status_label'>Next Transition At:</div>
					<div className='status_value'>{formatDate(this.props.nextTransitionTime)}</div>
				</div>
				<div className='status_container'>
					<div className='status_label'>Next Transition State:</div>
					<div className='status_value'>{this.props.nextTransitionState}</div>
				</div>
			</div>
		);
	}
});
