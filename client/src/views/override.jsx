import { createOverrideStateChangedAction } from 'actions/schedule';

export default React.createClass({
	onClicked(e) {
		const state = e.target.innerHTML.toLowerCase();
		if (state != this.props.overrideState) {
			createOverrideStateChangedAction(state);
		}
	},

	render() {
		const state = this.props.overrideState;
		const classNames = ['override_button', 'btn', 'btn-default', 'btn-lg', 'active'];
		return (
			<div className='override_container'>
				<div className='btn-group-vertical override_button_group' role='group'>
					<button
						type='button'
						className={classname(classNames, { active: state == 'day' })}
						onClick={this.onClicked}>
						Day
					</button>
					<button
						type='button'
						className={classname(classNames, { active: state == 'night' })}
						onClick={this.onClicked}>
						Night
					</button>
					<button
						type='button'
						className={classname(classNames, { active: state == 'off' })}
						onClick={this.onClicked}>
						Off
					</button>
				</div>
			</div>
		);
	}
});
