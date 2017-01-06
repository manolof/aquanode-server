import { createEditSavedAction, createEditCancelledAction } from 'actions/entry_state';

export default React.createClass({
	onSaveClicked() {
		createEditSavedAction();
	},
	onCancelClicked() {
		createEditCancelledAction();
	},
	onStateClicked(e) {
		const state = e.target.value;
		if (this.props.state !== state) {
			debugger;
		}
	},
	render() {
		const createStateRadioOptions = (label, checked) => {
			let input;
			if (checked) {
				input =
					<input type='radio' name='state_radios' onChange={this.onStateClicked} value={label.toLowerCase()} checked/>;
			} else {
				input = <input type='radio' name='state_radios' onChange={this.onStateClicked} value={label.toLowerCase()}/>;
			}
			return (
				<div className='radio'>
					<label>
						{input}
						{label}
					</label>
				</div>
			);
		};
		return (
			<div className='overlay'>
				<div className='popup_container'>
					<h2 className='popup_header'>Edit Schedule</h2>
					<div className='popup_body'>
						<div className='form-group'>
							<label>State</label>
							{createStateRadioOptions('Day', this.props.state === 'day')}
							{createStateRadioOptions('Night', this.props.state === 'night')}
							{createStateRadioOptions('Off', this.props.state === 'off')}
						</div>
						<div className='dialog_buttons'>
							<button style={{ marginRight: 20 }} className='btn btn-danger popup_button' onClick={this.onSaveClicked}>Save</button>
							<button className='btn btn-default popup_button' onClick={this.onCancelClicked}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});