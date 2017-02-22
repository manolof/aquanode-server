export function getSchedule(cb) {
	fetch('/api/schedule').then((response) => response.json()).then(cb);
}

export function getStatus(cb) {
	fetch('/api/status').then((response) => response.json()).then(cb);
}

export function saveSchedule(schedule, cb) {
	fetch(new Request('/api/schedule', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify(schedule)
	})).then(cb);
}
