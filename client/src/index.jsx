import { getSchedule, getStatus } from 'api';
import { createScheduleUpdatedAction } from 'actions/schedule';
import { createStatusUpdatedAction } from 'actions/status_updated';
import App from 'views/app';
import { registerCallback as registerScheduleCallback, getData as getScheduleData } from 'stores/schedule';
import { registerCallback as registerStatusCallback, getData as getStatusData } from 'stores/status';
import { registerCallback as registerEntryStateCallback, getData as getEntryStateData } from 'stores/entry_state';

setInterval(() => getStatus(createStatusUpdatedAction), 1000);
getSchedule(createScheduleUpdatedAction);

function render() {
	const props = {
		schedule: getScheduleData(),
		status: getStatusData(),
		entryState: getEntryStateData()
	};
	React.render(
		<App {...props} />,
		document.getElementById('content')
	);
}

registerScheduleCallback(render);
registerStatusCallback(render);
registerEntryStateCallback(render);
