import ScheduleEntry from 'views/schedule_entry';

export default React.createClass({
	render() {
		const entries = this.props.schedule.map((entry, i) => <ScheduleEntry {...entry} key={i} entryId={i}/>);
		return (
			<div className='program_container'>
				<div>
					{entries}
				</div>
			</div>
		);
	}
});
