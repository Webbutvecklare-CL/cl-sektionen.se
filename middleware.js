import { NextResponse } from "next/server";

export const config = {
  // Alla mottagningssidor ska vara skyddade med lösenord förutom /mottagning
  matcher: ["/mottagning/schema", "/mottagning/bilder", "/mottagning/info", "/mottagning/kontakt"],
};

// Kollar om användaren är inloggad, om inte skickas användaren till /mottagning/login
export async function middleware(req) {
  if (req.nextUrl.pathname.startsWith("/mottagning")) {
    const isLoggedIn =
      req.cookies.get("mottagning_key")?.value === process.env.NEXT_PUBLIC_MOTTAGNING_KEY;

    if (!isLoggedIn) {
      const redirectUrl = req.nextUrl.pathname.split("/mottagning/")[1];
      return NextResponse.redirect(
        new URL(`/mottagning/${redirectUrl ? "?url=" + redirectUrl : ""}`, req.url)
      );
    }
  }
  return NextResponse.next();
}
