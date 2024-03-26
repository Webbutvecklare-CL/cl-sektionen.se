function getPublicEvents(calendarId, query = {}) {
	const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
	const queryString = `key=${key}&${new URLSearchParams(query).toString()}`;
	const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${queryString}`;
	return new Promise((resolve, reject) => {
		fetch(url, { method: "GET" })
			.then((res) => {
				if (res.ok) {
					res.json().then((data) => {
						resolve(data.items);
					});
				} else {
					res.json().then((data) => {
						reject(data.error);
					});
				}
			})
			.catch((err) => reject(err));
	});
}

function createEvent(token, calendarId, data) {
	const event = {
		summary: data.title,
		description: data.description,
		start: {
			dateTime: data.start.toISOString(),
			timeZone: "Europe/Stockholm",
		},
		end: {
			dateTime: data.end.toISOString(),
			timeZone: "Europe/Stockholm",
		},
	};
	return new Promise((resolve, reject) => {
		fetch(
			`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, // Access token for google
				},
				body: JSON.stringify(event),
			},
		)
			.then((res) => {
				if (res.ok) {
					res.json().then((data) => {
						resolve(data.items);
					});
				} else {
					reject(res);
				}
			})
			.catch((err) => reject(err));
	});
}

export { getPublicEvents, createEvent };
