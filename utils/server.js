export function revalidate(page = "all", postId = "") {
  const url = `/api/revalidate?secret=${"Y3c6e9a07c10d202b26345t8b22bf4044"}&page=${page}&postId=${postId}`;
  const headers = {
    "Content-Type": "application/json",
    "method": "GET",
  };
  console.log("Sending revalidation request for " + page);
  fetch(url, headers)
    .then((res) => {
      if (res.ok) {
        console.log("Revalidation successful page: " + page);
      } else {
        console.warn("Revalidation unsuccessful", res.statusText);
      }
    })
    .catch((error) => console.error(error));
}

export function sendNotification(userId, postId) {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, postId }),
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
