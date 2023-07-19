/**
 *
 * @param {import("firebase/auth").User} user - User object from firebase
 * @param {Object} pages - Path as attribute and a boolean as key if it should be revalidated (post path has the postId as true)
 */
export function revalidate(user, pages) {
  const url = `/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_TOKEN}`;
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + user.accessToken,
    },
    body: JSON.stringify({ pages }),
  };
  console.log("Sending revalidation request for " + JSON.stringify(pages));
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log("Revalidation successful pages: " + JSON.stringify(data.pages));
        });
      } else {
        console.warn("Revalidation unsuccessful", res.statusText);
        res.json().then((data) => {
          console.error(data.message);
        });
      }
    })
    .catch((error) => console.error(error));
}

export function sendNotification(user, data) {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + user.accessToken,
    },
    body: JSON.stringify({ data }),
  };
  fetch(`/api/notifications`, options).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        console.log(data);
      });
    } else {
      res.json().then((data) => {
        console.error(data);
      });
    }
  });
}
