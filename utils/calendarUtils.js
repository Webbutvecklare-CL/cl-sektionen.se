function getPublicEvents(calendarId) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            resolve(data.items);
          });
        } else {
          reject(res.statusText);
        }
      })
      .catch((err) => reject(err));
  });
}

function createEvent(token, calendarId, data) {
  var event = {
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
    fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token, // Access token for google
      },
      body: JSON.stringify(event),
    })
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
