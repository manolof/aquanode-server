import { createDeleteCancelledAction, createDeleteConfirmedAction } from 'actions/entry_state';

export default React.createClass({
	onYesClicked() {
		createDeleteConfirmedAction();
	},
	onCancelClicked() {
		createDeleteCancelledAction();
	},
	render() {
		return (
			<div className='overlay'>
				<div className='popup_container'>
					<h2 className='popup_header'>Are you sure?</h2>
					<div className='popup_body'>
						<div className='dialog_buttons'>
							<button style={{ marginRight: 20 }} className='btn btn-danger popup_button' onClick={this.onYesClicked}>Yes</button>
							<button className='btn btn-default popup_button' onClick={this.onCancelClicked}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
