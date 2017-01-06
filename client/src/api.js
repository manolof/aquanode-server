export function getSchedule(cb) {
	fetch('http://localhost:3000/api/schedule').then((response) => response.json()).then(cb);
}

export function getStatus(cb) {
	fetch('http://localhost:3000/api/status').then((response) => response.json()).then(cb);
}

export function saveSchedule(schedule, cb) {
	fetch(new Request('http://localhost:3000/api/schedule', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify(schedule)
	})).then(cb);
}
