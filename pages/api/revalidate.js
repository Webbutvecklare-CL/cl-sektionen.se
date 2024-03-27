import { verifyUser } from "../../utils/apiUtils";

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    console.log("Verifying user");
    await verifyUser(req, res); // Verifierar att det är en inloggad användare
  } catch (err) {
    return res.status(401).json({ message: `Det gick inte att verifiera: ${err.error}` });
  }

  const pages = req.body.pages;
  if (!pages) {
    return res.status(400).json({ message: "No pages specified" });
  }

  console.log(req.body);
  const pagesResult = []; // Håller koll på om de lyckas revalidate:a eller inte
  if (pages.index) {
    try {
      // Försöker revalidate:a index
      await res.revalidate("/");
      pagesResult.push({ index: true });
      console.log("Revalidated index");
    } catch (err) {
      pagesResult.push({ index: false });
      console.log("Failed to revalidate index");
    }
  }
  if (pages.aktuellt) {
    try {
      // Försöker revalidate:a index
      await res.revalidate("/aktuellt");
      pagesResult.push({ aktuellt: true });
      console.log("Revalidated aktuellt");
    } catch (err) {
      pagesResult.push({ aktuellt: false });
      console.log("Failed to revalidate aktuellt");
    }
  }
  if (pages.post) {
    try {
      await res.revalidate(`/aktuellt/${pages.post}`);
      pagesResult.push({ post: true });
      console.log(`Revalidated /aktuellt/${pages.post}`);
    } catch (err) {
      pagesResult.push({ post: false });
      console.log(`Failed to revalidate /aktuellt/${pages.post}`);
    }
  }
  return res.status(200).json({ revalidated: true, pages: pagesResult });
}
