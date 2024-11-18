/**
 *
 * @param {import("firebase/auth").User} user - User object from firebase
 * @param {Object} pages - Path as attribute and a boolean as key if it should be revalidated (post path has the postId as true)
 */
export async function revalidate(user, pages) {
	const url = `/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_TOKEN}`;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${user.accessToken}`,
		},
		body: JSON.stringify({ pages }),
	};
	console.log(`Sending revalidation request for ${JSON.stringify(pages)}`);
	await fetch(url, options)
		.then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					console.log(
						`Revalidation successful pages: ${JSON.stringify(data.pages)}`,
					);
				});
			} else {
				console.error("Revalidation failed:", res.status, res.statusText);
				res.json().then((data) => {
					console.error("Revalidation error data:", data);
				});
				throw new Error("Revalidation unsuccessful");
			}
		})
		.catch((error) => {
			console.error("Revalidation fetch error:", error);
			throw new Error("Revalidation fetch unsuccessful");
		});
}

export async function sendNotification(user, data) {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${user.accessToken}`,
		},
		body: JSON.stringify({ data }),
	};

	let res;
	try {
		res = await fetch("/api/notifications", options);
	} catch (error) {
		console.error(error);
		throw new Error("Could not access notification endpoint");
	}

	if (res.ok) {
		try {
			const data = await res.json();
			console.log(data);
		} catch (error) {
			console.log("Notification sent but could not read response");
		}
	} else {
		let message = "Notification delivery unsuccessful";
		await res
			.json()
			.then((data) => {
				console.error(data);
				message = data.message;
			})
			.catch((error) => {
				console.error(error);
			});
		throw new Error(message);
	}
}
