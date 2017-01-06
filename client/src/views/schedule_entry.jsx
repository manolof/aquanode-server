import { createRequestDeleteAction, createRequestEditAction } from 'actions/entry_state';

export default React.createClass({
	onEditClicked() {
		createRequestEditAction(this.props.entryId);
	},
	onDeleteClicked() {
		createRequestDeleteAction(this.props.entryId);
	},
	render() {
		let entry;
		if (this.props.type == 'dynamic') {
			entry = (
				<div className='schedule_entry_group'>
					<div className='schedule_entry_label'>Event:</div>
					<div>{this.props.event}</div>
				</div>
			);
		} else {
			let hour = this.props.time.hour.toString();
			let minute = this.props.time.minute.toString();
			if (minute.length == 1) {
				minute = '0' + minute;
			}
			entry = (
				<div className='schedule_entry_group'>
					<div className='schedule_entry_label'>Time:</div>
					<div>{hour + ':' + minute}</div>
				</div>
			);
		}
		return (
			<div className='panel panel-default app_section'>
				<div className='panel-heading'>
					<div className='panel-title'><h4>{this.props.name}</h4></div>
				</div>
				<div className='panel-body'>
					<div className='schedule_entry_group'>
						<div className='schedule_entry_label'>State:</div>
						<div>{this.props.state}</div>
					</div>
					<div className='schedule_entry_group'>
						<div className='schedule_entry_label'>Type:</div>
						<div>{this.props.type}</div>
					</div>
					{entry}
				</div>
			</div>
		);
	}
});
