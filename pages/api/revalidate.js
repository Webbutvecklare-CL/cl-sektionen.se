export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const page = req.query.page;
  console.log(req.query);
  if (!page || page === "all") {
    try {
      // Försöker revalidate:a index
      await res.revalidate("/");
      await res.revalidate("/aktuellt");
      console.log("Revalidated index and aktuellt");
      return res.json({ revalidated: true, pages: "Index and Aktuellt" });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send("Error revalidating index and aktuellt");
    }
  } else if (page === "index") {
    try {
      // Försöker revalidate:a index
      await res.revalidate("/");
      console.log("Revalidated index");
      return res.json({ revalidated: true, pages: "Index" });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send("Error revalidating index");
    }
  } else if (page === "aktuellt") {
    try {
      // Försöker revalidate:a index
      await res.revalidate("/aktuellt");
      console.log("Revalidated aktuellt");
      return res.json({ revalidated: true, pages: "Aktuellt" });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send("Error revalidating aktuellt");
    }
  } else if (page === "post") {
    try {
      // Försöker revalidate:a index
      await res.revalidate(`/aktuellt/${req.query.postId}`);
      console.log(`Revalidated /aktuellt/${req.query.postId}`);
      return res.json({ revalidated: true, pages: `/aktuellt/${req.query.postId}` });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send(`Error revalidating post ${req.query.postId}`);
    }
  } else {
    return res.status(500).send(`Error revalidating no page specified`);
  }
}
