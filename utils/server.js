export function revalidate(page = "all", postId = "") {
  console.log(`Domain ${process.env.DOMAIN}`);
  const url = `http://${"localhost:3000"}/api/revalidate?secret=${"Y3c6e9a07c10d202b26345t8b22bf4044"}&page=${page}&postId=${postId}`;
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
